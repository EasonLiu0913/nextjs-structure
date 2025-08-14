import { z } from 'zod'

// 使用者偏好設定 Schema
export const userPreferencesSchema = z.object({
  language: z.enum(['en', 'zh'], {
    errorMap: () => ({ message: '請選擇有效的語言' })
  }),
  theme: z.enum(['light', 'dark', 'system'], {
    errorMap: () => ({ message: '請選擇有效的主題' })
  }),
  timezone: z.string().min(1, '請選擇時區'),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  profilePublic: z.boolean(),
  showEmail: z.boolean(),
  allowMessages: z.boolean()
})

// 預設偏好設定值
export const defaultUserPreferences = {
  language: 'zh' as const,
  theme: 'system' as const,
  timezone: 'Asia/Taipei',
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  profilePublic: true,
  showEmail: false,
  allowMessages: true
}

// 密碼變更 Schema
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, '請輸入目前密碼'),
  newPassword: z
    .string()
    .min(8, '新密碼至少需要 8 個字元')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '密碼需包含至少一個大寫字母、小寫字母和數字'
    ),
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "新密碼確認不一致",
  path: ["confirmNewPassword"]
})

// 帳戶刪除確認 Schema
export const deleteAccountSchema = z.object({
  confirmText: z
    .string()
    .min(1, '請輸入確認文字')
    .refine((val) => val === 'DELETE', {
      message: '請輸入 "DELETE" 來確認刪除帳戶'
    }),
  password: z
    .string()
    .min(1, '請輸入密碼以確認身份')
})

// 兩步驟驗證設定 Schema
export const twoFactorSchema = z.object({
  enabled: z.boolean(),
  method: z.enum(['app', 'sms', 'email']).optional(),
  backupCodes: z.array(z.string()).optional()
})

// 頭像上傳 Schema
export const avatarUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: '檔案大小不能超過 5MB'
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      {
        message: '只支援 JPEG、PNG 和 WebP 格式'
      }
    )
})

// 頭像資料 Schema
export const avatarDataSchema = z.object({
  id: z.string(),
  userId: z.string(),
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
  createdAt: z.date()
})

// 資料匯出請求 Schema
export const dataExportSchema = z.object({
  includeProfile: z.boolean().default(true),
  includePreferences: z.boolean().default(true),
  includeActivityLog: z.boolean().default(false),
  format: z.enum(['json', 'csv']).default('json')
})

// TypeScript 類型匯出
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>
export type TwoFactorInput = z.infer<typeof twoFactorSchema>
export type AvatarUploadInput = z.infer<typeof avatarUploadSchema>
export type AvatarData = z.infer<typeof avatarDataSchema>
export type DataExportInput = z.infer<typeof dataExportSchema>

// 使用者偏好設定完整資料模型
export interface UserPreferences {
  id: string
  userId: string
  language: string
  theme: 'light' | 'dark' | 'system'
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  profilePublic: boolean
  showEmail: boolean
  allowMessages: boolean
  createdAt: Date
  updatedAt: Date
}

// 使用者安全設定資料模型
export interface UserSecurity {
  id: string
  userId: string
  twoFactorEnabled: boolean
  twoFactorMethod?: 'app' | 'sms' | 'email'
  lastPasswordChange: Date
  loginAttempts: number
  lockedUntil?: Date
  backupCodes?: string[]
  createdAt: Date
  updatedAt: Date
}

// 使用者頭像資料模型
export interface UserAvatar {
  id: string
  userId: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  createdAt: Date
}