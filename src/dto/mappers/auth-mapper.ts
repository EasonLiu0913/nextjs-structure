import { 
  LoginRequestDTO, 
  RegisterRequestDTO, 
  ChangePasswordRequestDTO 
} from '../request/auth-dto'
import { 
  LoginResponseDTO, 
  RegisterResponseDTO, 
  UserDTO,
  UserSessionDTO 
} from '../response/auth-response'
import { LoginInput, RegisterInput, ChangePasswordInput } from '@/schemas/auth-schema'

// 表單資料轉換為請求 DTO
export class AuthRequestMapper {
  static fromLoginForm(formData: LoginInput): LoginRequestDTO {
    return {
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      rememberMe: false // 可以從表單中獲取
    }
  }

  static fromRegisterForm(formData: RegisterInput): RegisterRequestDTO {
    return {
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      acceptTerms: true // 可以從表單中獲取
    }
  }

  static fromChangePasswordForm(formData: ChangePasswordInput): ChangePasswordRequestDTO {
    return {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword
    }
  }

  static fromFormData(formData: FormData, type: 'login'): LoginRequestDTO
  static fromFormData(formData: FormData, type: 'register'): RegisterRequestDTO
  static fromFormData(formData: FormData, type: 'changePassword'): ChangePasswordRequestDTO
  static fromFormData(formData: FormData, type: string): any {
    switch (type) {
      case 'login':
        return {
          email: (formData.get('email') as string)?.toLowerCase().trim(),
          password: formData.get('password') as string,
          rememberMe: formData.get('rememberMe') === 'true'
        }
      case 'register':
        return {
          name: (formData.get('name') as string)?.trim(),
          email: (formData.get('email') as string)?.toLowerCase().trim(),
          password: formData.get('password') as string,
          confirmPassword: formData.get('confirmPassword') as string,
          acceptTerms: formData.get('acceptTerms') === 'true'
        }
      case 'changePassword':
        return {
          currentPassword: formData.get('currentPassword') as string,
          newPassword: formData.get('newPassword') as string,
          confirmNewPassword: formData.get('confirmNewPassword') as string
        }
      default:
        throw new Error(`Unknown form type: ${type}`)
    }
  }
}

// API 回應轉換為前端使用的格式
export class AuthResponseMapper {
  static toUser(apiUser: any): UserDTO {
    return {
      id: apiUser.id,
      email: apiUser.email,
      name: apiUser.name,
      avatar: apiUser.avatar || apiUser.image,
      role: apiUser.role || 'user',
      status: apiUser.status || 'active',
      emailVerified: apiUser.emailVerified || false,
      lastLoginAt: apiUser.lastLoginAt,
      createdAt: apiUser.createdAt || new Date().toISOString(),
      updatedAt: apiUser.updatedAt || new Date().toISOString()
    }
  }

  static toLoginResponse(apiResponse: any): LoginResponseDTO {
    return {
      user: this.toUser(apiResponse.user),
      tokens: {
        accessToken: apiResponse.accessToken || apiResponse.token,
        refreshToken: apiResponse.refreshToken,
        expiresIn: apiResponse.expiresIn || 3600,
        tokenType: 'Bearer'
      },
      session: {
        id: apiResponse.sessionId || apiResponse.session?.id,
        expiresAt: apiResponse.sessionExpiresAt || apiResponse.session?.expiresAt
      }
    }
  }

  static toRegisterResponse(apiResponse: any): RegisterResponseDTO {
    return {
      user: this.toUser(apiResponse.user),
      message: apiResponse.message || 'Registration successful',
      requiresEmailVerification: apiResponse.requiresEmailVerification || false
    }
  }

  static toUserSession(apiSession: any): UserSessionDTO {
    return {
      id: apiSession.id,
      userId: apiSession.userId,
      deviceInfo: {
        userAgent: apiSession.userAgent || '',
        ip: apiSession.ipAddress || '',
        location: apiSession.location,
        device: this.extractDevice(apiSession.userAgent),
        browser: this.extractBrowser(apiSession.userAgent)
      },
      isActive: apiSession.isActive || false,
      lastActivityAt: apiSession.lastActivityAt || apiSession.updatedAt,
      createdAt: apiSession.createdAt
    }
  }

  private static extractDevice(userAgent: string): string {
    if (!userAgent) return 'Unknown'
    
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'Mobile'
    } else if (/Tablet/.test(userAgent)) {
      return 'Tablet'
    } else {
      return 'Desktop'
    }
  }

  private static extractBrowser(userAgent: string): string {
    if (!userAgent) return 'Unknown'
    
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    
    return 'Unknown'
  }
}

// NextAuth.js 特定的轉換器
export class NextAuthMapper {
  static fromNextAuthUser(nextAuthUser: any): UserDTO {
    return {
      id: nextAuthUser.id,
      email: nextAuthUser.email,
      name: nextAuthUser.name,
      avatar: nextAuthUser.image,
      role: nextAuthUser.role || 'user',
      status: 'active',
      emailVerified: nextAuthUser.emailVerified || false,
      lastLoginAt: new Date().toISOString(),
      createdAt: nextAuthUser.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  static fromNextAuthSession(session: any): Partial<LoginResponseDTO> {
    return {
      user: this.fromNextAuthUser(session.user),
      session: {
        id: session.sessionToken || 'nextauth-session',
        expiresAt: session.expires
      }
    }
  }
}