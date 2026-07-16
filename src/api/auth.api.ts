import api from './axios.instance';
import type {
  ApiResponse,
  AuthTokens,
  LoginPayload,
  MessageData,
  RegisterPayload,
  ResendOtpPayload,
  VerifyEmailPayload,
} from '../types/auth.types';

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<MessageData>>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthTokens>>('/auth/login', payload),

  verifyEmail: (payload: VerifyEmailPayload) =>
    api.post<ApiResponse<AuthTokens>>('/auth/verify-email', payload),

  resendOtp: (payload: ResendOtpPayload) =>
    api.post<ApiResponse<MessageData>>('/auth/resend-verification-otp', payload),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<AuthTokens>>('/auth/refresh', undefined, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    }),

  logout: (refreshToken: string) =>
    api.post<ApiResponse<MessageData>>('/auth/logout', undefined, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    }),
};
