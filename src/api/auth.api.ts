import api from './axios.instance';
import type {
  ApiResponse,
  AuthTokens,
  LoginPayload,
  MessageData,
  RegisterPayload,
  ResendOtpPayload,
  VerifyEmailPayload,
  ForgotPasswordPayload,
  VerifyResetOtpPayload,
  ResetPasswordPayload,
  ResetTokenData,
} from '../types/auth.types';
import { encryptPassword } from '../utils/crypto.util';

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<MessageData>>('/auth/register', {
      ...payload,
      password: encryptPassword(payload.password),
    }),

  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthTokens>>('/auth/login', {
      ...payload,
      password: encryptPassword(payload.password),
    }),

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

  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post<ApiResponse<MessageData>>('/auth/forgot-password', payload),

  verifyResetOtp: (payload: VerifyResetOtpPayload) =>
    api.post<ApiResponse<ResetTokenData>>('/auth/verify-reset-otp', payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<ApiResponse<MessageData>>('/auth/reset-password', {
      ...payload,
      password: encryptPassword(payload.password),
    }),
};
