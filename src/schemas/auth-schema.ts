import { z } from 'zod'

// 登入驗證
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '請輸入電子郵件')
    .email('請輸入有效的電子郵件格式'),
  password: z
    .string()
    .min(1, '請輸入密碼')
    .min(8, '密碼至少需要 8 個字元')
})

// 註冊驗證
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, '請輸入姓名')
    .min(2, '姓名至少需要 2 個字元')
    .max(50, '姓名不能超過 50 個字元'),
  email: z
    .string()
    .min(1, '請輸入電子郵件')
    .email('請輸入有效的電子郵件格式'),
  password: z
    .string()
    .min(8, '密碼至少需要 8 個字元')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '密碼需包含至少一個大寫字母、小寫字母和數字'
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "密碼確認不一致",
  path: ["confirmPassword"]
})

// 重設密碼驗證
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, '請輸入電子郵件')
    .email('請輸入有效的電子郵件格式')
})

// 更改密碼驗證
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

// 類型匯出
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>