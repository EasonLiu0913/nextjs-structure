import { 
  UpdateUserProfileRequestDTO, 
  UpdateUserPreferencesRequestDTO,
  SearchUsersRequestDTO 
} from '../request/user-dto'
import { 
  UserProfileResponseDTO, 
  UserPreferencesResponseDTO,
  UserActivityDTO,
  UserSearchResultDTO,
  UserNotificationDTO 
} from '../response/user-response'
import { UserProfileInput, UserPreferencesInput } from '@/schemas/user-schema'

// 使用者請求資料轉換器
export class UserRequestMapper {
  static fromProfileForm(formData: UserProfileInput): UpdateUserProfileRequestDTO {
    return {
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone?.trim() || undefined,
      bio: formData.bio?.trim() || undefined,
      website: formData.website?.trim() || undefined,
      location: formData.location?.trim() || undefined
    }
  }

  static fromPreferencesForm(formData: UserPreferencesInput): UpdateUserPreferencesRequestDTO {
    return {
      language: formData.language,
      theme: formData.theme,
      notifications: {
        email: formData.notifications.email,
        push: formData.notifications.push,
        marketing: formData.notifications.marketing
      },
      privacy: {
        profilePublic: formData.privacy.profilePublic,
        showEmail: formData.privacy.showEmail,
        allowMessages: formData.privacy.allowMessages
      }
    }
  }

  static fromFormData(formData: FormData, type: 'profile'): UpdateUserProfileRequestDTO
  static fromFormData(formData: FormData, type: 'preferences'): UpdateUserPreferencesRequestDTO
  static fromFormData(formData: FormData, type: string): any {
    switch (type) {
      case 'profile':
        return {
          name: (formData.get('name') as string)?.trim(),
          email: (formData.get('email') as string)?.toLowerCase().trim(),
          phone: (formData.get('phone') as string)?.trim() || undefined,
          bio: (formData.get('bio') as string)?.trim() || undefined,
          website: (formData.get('website') as string)?.trim() || undefined,
          location: (formData.get('location') as string)?.trim() || undefined
        }
      case 'preferences':
        return {
          language: formData.get('language') as 'en' | 'zh',
          theme: formData.get('theme') as 'light' | 'dark' | 'system',
          notifications: {
            email: formData.get('notifications.email') === 'true',
            push: formData.get('notifications.push') === 'true',
            marketing: formData.get('notifications.marketing') === 'true'
          },
          privacy: {
            profilePublic: formData.get('privacy.profilePublic') === 'true',
            showEmail: formData.get('privacy.showEmail') === 'true',
            allowMessages: formData.get('privacy.allowMessages') === 'true'
          }
        }
      default:
        throw new Error(`Unknown form type: ${type}`)
    }
  }

  static fromSearchParams(searchParams: URLSearchParams): SearchUsersRequestDTO {
    return {
      query: searchParams.get('q') || '',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      filters: {
        role: searchParams.get('role') || undefined,
        status: (searchParams.get('status') as 'active' | 'inactive' | 'banned') || undefined,
        location: searchParams.get('location') || undefined
      }
    }
  }
}

// 使用者回應資料轉換器
export class UserResponseMapper {
  static toUserProfile(apiResponse: any): UserProfileResponseDTO {
    return {
      id: apiResponse.id,
      email: apiResponse.email,
      name: apiResponse.name,
      avatar: apiResponse.avatar,
      role: apiResponse.role || 'user',
      status: apiResponse.status || 'active',
      emailVerified: apiResponse.emailVerified || false,
      lastLoginAt: apiResponse.lastLoginAt,
      createdAt: apiResponse.createdAt,
      updatedAt: apiResponse.updatedAt,
      profile: {
        phone: apiResponse.profile?.phone,
        bio: apiResponse.profile?.bio,
        website: apiResponse.profile?.website,
        location: apiResponse.profile?.location,
        dateOfBirth: apiResponse.profile?.dateOfBirth,
        gender: apiResponse.profile?.gender,
        timezone: apiResponse.profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: apiResponse.profile?.language || 'en'
      },
      stats: {
        loginCount: apiResponse.stats?.loginCount || 0,
        lastLoginAt: apiResponse.stats?.lastLoginAt,
        accountAge: apiResponse.stats?.accountAge || this.calculateAccountAge(apiResponse.createdAt)
      }
    }
  }

  static toUserPreferences(apiResponse: any): UserPreferencesResponseDTO {
    return {
      language: apiResponse.language || 'en',
      theme: apiResponse.theme || 'system',
      notifications: {
        email: apiResponse.notifications?.email ?? true,
        push: apiResponse.notifications?.push ?? true,
        marketing: apiResponse.notifications?.marketing ?? false,
        security: apiResponse.notifications?.security ?? true
      },
      privacy: {
        profilePublic: apiResponse.privacy?.profilePublic ?? false,
        showEmail: apiResponse.privacy?.showEmail ?? false,
        allowMessages: apiResponse.privacy?.allowMessages ?? true,
        showOnlineStatus: apiResponse.privacy?.showOnlineStatus ?? true
      },
      accessibility: {
        reducedMotion: apiResponse.accessibility?.reducedMotion ?? false,
        highContrast: apiResponse.accessibility?.highContrast ?? false,
        fontSize: apiResponse.accessibility?.fontSize || 'medium'
      }
    }
  }

  static toUserActivity(apiActivity: any): UserActivityDTO {
    return {
      id: apiActivity.id,
      userId: apiActivity.userId,
      type: apiActivity.type,
      description: apiActivity.description || this.generateActivityDescription(apiActivity.type),
      metadata: apiActivity.metadata,
      ipAddress: apiActivity.ipAddress || 'Unknown',
      userAgent: apiActivity.userAgent || 'Unknown',
      createdAt: apiActivity.createdAt
    }
  }

  static toUserSearchResult(apiUser: any): UserSearchResultDTO {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      avatar: apiUser.avatar,
      role: apiUser.role || 'user',
      status: apiUser.status || 'active',
      lastLoginAt: apiUser.lastLoginAt,
      createdAt: apiUser.createdAt
    }
  }

  static toUserNotification(apiNotification: any): UserNotificationDTO {
    return {
      id: apiNotification.id,
      userId: apiNotification.userId,
      type: apiNotification.type || 'info',
      title: apiNotification.title,
      message: apiNotification.message,
      isRead: apiNotification.isRead || false,
      actionUrl: apiNotification.actionUrl,
      actionText: apiNotification.actionText,
      createdAt: apiNotification.createdAt
    }
  }

  private static calculateAccountAge(createdAt: string): number {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // days
  }

  private static generateActivityDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'login': 'User logged in',
      'logout': 'User logged out',
      'profile_update': 'Profile information updated',
      'password_change': 'Password changed',
      'settings_change': 'Settings updated'
    }
    
    return descriptions[type] || 'Unknown activity'
  }
}

// 資料清理和驗證工具
export class UserDataCleaner {
  static cleanProfileData(data: any): UpdateUserProfileRequestDTO {
    return {
      name: this.sanitizeString(data.name),
      email: this.sanitizeEmail(data.email),
      phone: data.phone ? this.sanitizePhone(data.phone) : undefined,
      bio: data.bio ? this.sanitizeString(data.bio, 500) : undefined,
      website: data.website ? this.sanitizeUrl(data.website) : undefined,
      location: data.location ? this.sanitizeString(data.location, 100) : undefined
    }
  }

  private static sanitizeString(str: string, maxLength = 255): string {
    return str.trim().substring(0, maxLength)
  }

  private static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
  }

  private static sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-\s()]/g, '').trim()
  }

  private static sanitizeUrl(url: string): string {
    const trimmed = url.trim()
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`
    }
    return trimmed
  }
}