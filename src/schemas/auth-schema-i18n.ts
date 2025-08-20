import { z } from 'zod'

// 動態驗證 schema 生成函數，支持國際化
export function createLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t('Auth.validation.emailRequired'))
      .email(t('Auth.validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('Auth.validation.passwordRequired'))
      .min(8, t('Auth.validation.passwordMinLength'))
  })
}

export function createRegisterSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string()
      .min(1, t('Auth.validation.nameRequired'))
      .min(2, t('Auth.validation.nameMinLength'))
      .max(50, t('Auth.validation.nameMaxLength')),
    email: z
      .string()
      .min(1, t('Auth.validation.emailRequired'))
      .email(t('Auth.validation.emailInvalid')),
    password: z
      .string()
      .min(8, t('Auth.validation.passwordMinLength'))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t('Auth.validation.passwordRequirements')
      ),
    confirmPassword: z.string().min(1, t('Auth.validation.passwordConfirmRequired'))
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('Auth.validation.passwordConfirmMismatch'),
    path: ["confirmPassword"]
  })
}

export function createResetPasswordSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t('Auth.validation.emailRequired'))
      .email(t('Auth.validation.emailInvalid'))
  })
}

export function createChangePasswordSchema(t: (key: string) => string) {
  return z.object({
    currentPassword: z
      .string()
      .min(1, t('Auth.validation.currentPasswordRequired')),
    newPassword: z
      .string()
      .min(8, t('Auth.validation.passwordMinLength'))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t('Auth.validation.passwordRequirements')
      ),
    confirmNewPassword: z.string().min(1, t('Auth.validation.passwordConfirmRequired'))
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: t('Auth.validation.passwordConfirmMismatch'),
    path: ["confirmNewPassword"]
  })
}

// 類型匯出 - 這些保持不變
export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>
export type ResetPasswordInput = z.infer<ReturnType<typeof createResetPasswordSchema>>
export type ChangePasswordInput = z.infer<ReturnType<typeof createChangePasswordSchema>>