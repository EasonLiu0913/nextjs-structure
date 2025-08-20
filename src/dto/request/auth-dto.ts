import { loginSchema, registerSchema, changePasswordSchema } from '@/schemas/auth-schema'

// 登入請求 DTO
export interface LoginRequestDTO {
  email: string
  password: string
  rememberMe?: boolean
}

// 註冊請求 DTO
export interface RegisterRequestDTO {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms?: boolean
}

// 更改密碼請求 DTO
export interface ChangePasswordRequestDTO {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

// 重設密碼請求 DTO
export interface ResetPasswordRequestDTO {
  email: string
}

// 確認重設密碼請求 DTO
export interface ConfirmResetPasswordRequestDTO {
  token: string
  newPassword: string
  confirmNewPassword: string
}

// OAuth 登入請求 DTO
export interface OAuthLoginRequestDTO {
  provider: 'google' | 'github' | 'facebook'
  code: string
  state?: string
}

// 刷新 Token 請求 DTO
export interface RefreshTokenRequestDTO {
  refreshToken: string
}

// 登出請求 DTO
export interface LogoutRequestDTO {
  refreshToken?: string
  logoutFromAllDevices?: boolean
}

// 驗證 Email 請求 DTO
export interface VerifyEmailRequestDTO {
  token: string
}

// 重新發送驗證 Email 請求 DTO
export interface ResendVerificationRequestDTO {
  email: string
}

// 類型守衛函數
export const isLoginRequest = (data: any): data is LoginRequestDTO => {
  return loginSchema.safeParse(data).success
}

export const isRegisterRequest = (data: any): data is RegisterRequestDTO => {
  return registerSchema.safeParse(data).success
}

export const isChangePasswordRequest = (data: any): data is ChangePasswordRequestDTO => {
  return changePasswordSchema.safeParse(data).success
}