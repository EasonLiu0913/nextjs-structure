import { BaseDTO } from '../types'

// 使用者基本資訊 DTO
export interface UserDTO extends BaseDTO {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
  status: 'active' | 'inactive' | 'banned'
  emailVerified: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

// 登入回應 DTO
export interface LoginResponseDTO {
  user: UserDTO
  tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
    tokenType: 'Bearer'
  }
  session: {
    id: string
    expiresAt: string
  }
}

// 註冊回應 DTO
export interface RegisterResponseDTO {
  user: Omit<UserDTO, 'lastLoginAt'>
  message: string
  requiresEmailVerification: boolean
}

// Token 刷新回應 DTO
export interface RefreshTokenResponseDTO {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}

// 密碼重設回應 DTO
export interface ResetPasswordResponseDTO {
  message: string
  emailSent: boolean
}

// 確認密碼重設回應 DTO
export interface ConfirmResetPasswordResponseDTO {
  message: string
  success: boolean
}

// 登出回應 DTO
export interface LogoutResponseDTO {
  message: string
  success: boolean
}

// Email 驗證回應 DTO
export interface VerifyEmailResponseDTO {
  message: string
  success: boolean
  user?: UserDTO
}

// OAuth 登入回應 DTO
export interface OAuthLoginResponseDTO extends LoginResponseDTO {
  isNewUser: boolean
  provider: string
}

// 使用者會話資訊 DTO
export interface UserSessionDTO {
  id: string
  userId: string
  deviceInfo: {
    userAgent: string
    ip: string
    location?: string
    device: string
    browser: string
  }
  isActive: boolean
  lastActivityAt: string
  createdAt: string
}

// 使用者會話列表回應 DTO
export interface UserSessionsResponseDTO {
  sessions: UserSessionDTO[]
  currentSessionId: string
}

// 帳戶安全資訊 DTO
export interface AccountSecurityDTO {
  twoFactorEnabled: boolean
  lastPasswordChange?: string
  loginAttempts: {
    failed: number
    lastFailedAt?: string
  }
  securityEvents: {
    type: 'login' | 'password_change' | 'email_change' | 'suspicious_activity'
    timestamp: string
    details: string
  }[]
}