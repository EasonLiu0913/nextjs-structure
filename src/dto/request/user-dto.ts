import { z } from 'zod'
import { userProfileSchema, userPreferencesSchema } from '@/schemas/user-schema'

// 更新使用者個人資料請求 DTO
export interface UpdateUserProfileRequestDTO {
  name: string
  email: string
  phone?: string
  bio?: string
  website?: string
  location?: string
  avatar?: string
}

// 更新使用者偏好請求 DTO
export interface UpdateUserPreferencesRequestDTO {
  language: 'en' | 'zh'
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  privacy: {
    profilePublic: boolean
    showEmail: boolean
    allowMessages: boolean
  }
}

// 上傳頭像請求 DTO
export interface UploadAvatarRequestDTO {
  file: File
  cropData?: {
    x: number
    y: number
    width: number
    height: number
  }
}

// 搜尋使用者請求 DTO
export interface SearchUsersRequestDTO {
  query: string
  page?: number
  limit?: number
  filters?: {
    role?: string
    status?: 'active' | 'inactive' | 'banned'
    location?: string
  }
}

// 更新使用者狀態請求 DTO
export interface UpdateUserStatusRequestDTO {
  userId: string
  status: 'active' | 'inactive' | 'banned'
  reason?: string
}

// 刪除使用者帳戶請求 DTO
export interface DeleteUserAccountRequestDTO {
  password: string
  reason?: string
  feedback?: string
}

// 匯出使用者資料請求 DTO
export interface ExportUserDataRequestDTO {
  format: 'json' | 'csv' | 'pdf'
  includePersonalData: boolean
  includeActivityData: boolean
}

// 批量操作使用者請求 DTO
export interface BulkUserOperationRequestDTO {
  userIds: string[]
  operation: 'activate' | 'deactivate' | 'delete' | 'export'
  options?: Record<string, any>
}

// 類型守衛函數
export const isUpdateUserProfileRequest = (data: any): data is UpdateUserProfileRequestDTO => {
  return userProfileSchema.safeParse(data).success
}

export const isUpdateUserPreferencesRequest = (data: any): data is UpdateUserPreferencesRequestDTO => {
  return userPreferencesSchema.safeParse(data).success
}

export const isSearchUsersRequest = (data: any): data is SearchUsersRequestDTO => {
  const schema = z.object({
    query: z.string().min(1),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
    filters: z.object({
      role: z.string().optional(),
      status: z.enum(['active', 'inactive', 'banned']).optional(),
      location: z.string().optional()
    }).optional()
  })
  
  return schema.safeParse(data).success
}