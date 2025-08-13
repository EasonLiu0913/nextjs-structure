import { z } from 'zod'

// 使用者個人資料驗證
export const userProfileSchema = z.object({
  name: z
    .string()
    .min(1, '請輸入姓名')
    .min(2, '姓名至少需要 2 個字元')
    .max(50, '姓名不能超過 50 個字元'),
  email: z
    .string()
    .min(1, '請輸入電子郵件')
    .email('請輸入有效的電子郵件格式'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9+\-\s()]+$/.test(val), {
      message: '請輸入有效的電話號碼'
    }),
  bio: z
    .string()
    .max(500, '個人簡介不能超過 500 個字元')
    .optional(),
  website: z
    .string()
    .url('請輸入有效的網址')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(100, '地點不能超過 100 個字元')
    .optional()
})

// 使用者偏好設定驗證
export const userPreferencesSchema = z.object({
  language: z.enum(['en', 'zh'], {
    errorMap: () => ({ message: '請選擇有效的語言' })
  }),
  theme: z.enum(['light', 'dark', 'system'], {
    errorMap: () => ({ message: '請選擇有效的主題' })
  }),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean()
  }),
  privacy: z.object({
    profilePublic: z.boolean(),
    showEmail: z.boolean(),
    allowMessages: z.boolean()
  })
})

// 類型匯出
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>