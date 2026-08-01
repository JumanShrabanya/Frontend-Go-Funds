import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authSession } from '../auth/auth-session';

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Single-flight refresh token promise to prevent race conditions during concurrent 401s
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = authSession.getRefreshToken();
    if (!refreshToken) {
      authSession.clear();
      return null;
    }

    try {
      // Use clean axios instance to bypass interceptors
      const response = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        undefined,
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      const tokens = response.data?.data;
      if (tokens?.accessToken) {
        authSession.save(tokens);
        return tokens.accessToken as string;
      }

      authSession.clear();
      return null;
    } catch {
      authSession.clear();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
        window.location.href = '/auth/login';
      }
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Request Interceptor: Attach access token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = authSession.getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor: Seamless 401 retry & response unwrap
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string | string[]; error?: string }>) => {
    const request = error.config as RetriableRequest | undefined;
    const status = error.response?.status;
    const requestUrl = request?.url ?? '';
    const isAuthEndpoint = requestUrl.includes('/auth/login') ||
                           requestUrl.includes('/auth/register') ||
                           requestUrl.includes('/auth/refresh') ||
                           requestUrl.includes('/auth/verify-otp') ||
                           requestUrl.includes('/auth/reset-otp') ||
                           requestUrl.includes('/auth/forgot-password');

    // Handle 401 Unauthorized seamlessly
    if (status === 401 && request && !request._retry && !isAuthEndpoint) {
      request._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        request.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(request);
      }
    }

    const responseMessage = error.response?.data?.message;
    const message = Array.isArray(responseMessage)
      ? responseMessage.join(' ')
      : responseMessage ?? error.response?.data?.error ?? 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default api;
