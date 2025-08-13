import { BaseDTO } from '../types'
import { UserDTO } from './auth-response'

// 使用者個人資料回應 DTO
export interface UserProfileResponseDTO extends UserDTO {
  profile: {
    phone?: string
    bio?: string
    website?: string
    location?: string
    dateOfBirth?: string
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
    timezone?: string
    language: 'en' | 'zh'
  }
  stats: {
    loginCount: number
    lastLoginAt?: string
    accountAge: number // days since registration
  }
}

// 使用者偏好設定回應 DTO
export interface UserPreferencesResponseDTO {
  language: 'en' | 'zh'
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
    security: boolean
  }
  privacy: {
    profilePublic: boolean
    showEmail: boolean
    allowMessages: boolean
    showOnlineStatus: boolean
  }
  accessibility: {
    reducedMotion: boolean
    highContrast: boolean
    fontSize: 'small' | 'medium' | 'large'
  }
}

// 使用者活動記錄 DTO
export interface UserActivityDTO extends BaseDTO {
  id: string
  userId: string
  type: 'login' | 'logout' | 'profile_update' | 'password_change' | 'settings_change'
  description: string
  metadata?: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: string
}

// 使用者活動記錄回應 DTO
export interface UserActivitiesResponseDTO {
  activities: UserActivityDTO[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 使用者搜尋結果 DTO
export interface UserSearchResultDTO {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  status: 'active' | 'inactive' | 'banned'
  lastLoginAt?: string
  createdAt: string
}

// 使用者搜尋回應 DTO
export interface SearchUsersResponseDTO {
  users: UserSearchResultDTO[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    role?: string
    status?: string
    location?: string
  }
}

// 使用者統計資料 DTO
export interface UserStatsDTO {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  usersByRole: Record<string, number>
  usersByStatus: Record<string, number>
  topLocations: Array<{
    location: string
    count: number
  }>
}

// 使用者匯出資料 DTO
export interface UserDataExportDTO {
  exportId: string
  format: 'json' | 'csv' | 'pdf'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  downloadUrl?: string
  createdAt: string
  expiresAt: string
  fileSize?: number
}

// 批量操作結果 DTO
export interface BulkOperationResultDTO {
  operationId: string
  operation: string
  totalItems: number
  successCount: number
  failureCount: number
  results: Array<{
    itemId: string
    success: boolean
    error?: string
  }>
  completedAt: string
}

// 使用者通知 DTO
export interface UserNotificationDTO extends BaseDTO {
  id: string
  userId: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  actionText?: string
  createdAt: string
}

// 使用者通知回應 DTO
export interface UserNotificationsResponseDTO {
  notifications: UserNotificationDTO[]
  unreadCount: number
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}