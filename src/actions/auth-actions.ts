'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { 
  AuthRequestMapper, 
  AuthResponseMapper,
  createActionSuccess,
  createActionError,
  createValidationError,
  // zodErrorToFieldErrors,
  validateDTO,
  sanitizeDTO
} from '@/dto'
import { loginSchema, registerSchema, changePasswordSchema } from '@/schemas/auth-schema'

// 登入 Action
export async function loginAction(formData: FormData) {
  try {
    // 使用 DTO mapper 轉換表單資料
    const loginRequest = AuthRequestMapper.fromFormData(formData, 'login')
    
    // 驗證資料
    const validation = validateDTO(loginSchema, loginRequest)
    if (!validation.success) {
      return createValidationError(validation.errors || {})
    }
    
    // 清理資料
    const cleanData = sanitizeDTO(validation.data!)
    
    // 模擬驗證邏輯 (這個函數現在不會被使用，因為我們使用 NextAuth)
    if (cleanData.email === 'user@example.com' && cleanData.password === 'password123') {
      return createActionSuccess({ redirectTo: '/dashboard' }, 'Login successful')
    } else {
      return createActionError('Invalid email or password')
    }
  } catch (error) {
    console.error('Login error:', error)
    return createActionError('An error occurred during login')
  }
}

// 註冊 Action
export async function registerAction(formData: FormData) {
  try {
    // 使用 DTO mapper 轉換表單資料
    const registerRequest = AuthRequestMapper.fromFormData(formData, 'register')
    
    // 驗證資料
    const validation = validateDTO(registerSchema, registerRequest)
    if (!validation.success) {
      return createValidationError(validation.errors || {})
    }
    
    // 清理資料
    const cleanData = sanitizeDTO(validation.data!)
    
    // 檢查使用者是否已存在（模擬）
    if (cleanData.email === 'existing@example.com') {
      return createActionError('User already exists with this email')
    }
    
    // 加密密碼
    const hashedPassword = await bcrypt.hash(cleanData.password, 12)
    
    // 這裡應該建立使用者到資料庫
    console.log('Creating user:', { 
      name: cleanData.name, 
      email: cleanData.email, 
      hashedPassword 
    })
    
    // 建立回應 DTO
    AuthResponseMapper.toRegisterResponse({
      user: {
        id: '1',
        name: cleanData.name,
        email: cleanData.email,
        createdAt: new Date().toISOString()
      },
      message: 'Registration successful',
      requiresEmailVerification: false
    })
    
    // 註冊成功，返回成功狀態
    return createActionSuccess({ redirectTo: '/login' }, 'Registration successful')
    
  } catch (error) {
    console.error('Registration error:', error)
    return createActionError('An error occurred during registration')
  }
}

// 登出 Action
export async function logoutAction() {
  try {
    // 這裡應該使用 NextAuth 的 signOut
    // await signOut({ redirect: false })
    redirect('/')
  } catch (error) {
    console.error('Logout error:', error)
    return createActionError('An error occurred during logout')
  }
}

// 更改密碼 Action
export async function changePasswordAction(formData: FormData) {
  try {
    // 使用 DTO mapper 轉換表單資料
    const changePasswordRequest = AuthRequestMapper.fromFormData(formData, 'changePassword')
    
    // 驗證資料
    const validation = validateDTO(changePasswordSchema, changePasswordRequest)
    if (!validation.success) {
      return createValidationError(validation.errors || {})
    }
    
    // 清理資料
    sanitizeDTO(validation.data!)
    
    // 這裡應該實作密碼更改邏輯
    // 1. 驗證目前密碼
    // 2. 更新新密碼
    
    revalidatePath('/profile')
    return createActionSuccess(undefined, 'Password changed successfully')
    
  } catch (error) {
    console.error('Change password error:', error)
    return createActionError('An error occurred while changing password')
  }
}