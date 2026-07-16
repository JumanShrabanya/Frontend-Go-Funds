import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authSession } from '../auth/auth-session';

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach access token to every request automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = authSession.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Unwrap the { success, data, timestamp } envelope globally
let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string | string[]; error?: string }>) => {
    const request = error.config as RetriableRequest | undefined;
    const status = error.response?.status;
    const requestUrl = request?.url ?? '';
    const isAuthRequest = requestUrl.startsWith('/auth/');

    if (status === 401 && request && !request._retry && !isAuthRequest) {
      request._retry = true;
      refreshPromise ??= refreshAccessToken();
      const accessToken = await refreshPromise;
      refreshPromise = null;

      if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
        return api(request);
      }
    }

    const responseMessage = error.response?.data?.message;
    const message = Array.isArray(responseMessage)
      ? responseMessage.join(' ')
      : responseMessage ?? error.response?.data?.error ?? 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  },
);

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authSession.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await api.post('/auth/refresh', undefined, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    authSession.save(response.data.data);
    return response.data.data.accessToken;
  } catch {
    authSession.clear();
    return null;
  }
}

export default api;
