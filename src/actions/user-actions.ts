'use server'

import { revalidatePath } from 'next/cache'
import { 
  UserRequestMapper, 
  UserResponseMapper,
  UserDataCleaner,
  createActionSuccess,
  createActionError,
  createValidationError,
  validateDTO,
  sanitizeDTO
} from '@/dto'
import { userProfileSchema, userPreferencesSchema } from '@/schemas/user-schema'

// 更新使用者個人資料
export async function updateProfileAction(formData: FormData) {
  try {
    // 使用 DTO mapper 轉換表單資料
    const profileRequest = UserRequestMapper.fromFormData(formData, 'profile')
    
    // 驗證資料
    const validation = validateDTO(userProfileSchema, profileRequest)
    if (!validation.success) {
      return createValidationError(validation.errors || {})
    }
    
    // 清理和驗證資料
    const cleanData = UserDataCleaner.cleanProfileData(validation.data!)
    
    // 這裡應該更新使用者資料到資料庫
    console.log('Updating user profile:', cleanData)
    
    // 模擬回應資料
    const updatedProfile = UserResponseMapper.toUserProfile({
      id: '1',
      ...cleanData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        ...cleanData,
        language: 'en'
      },
      stats: {
        loginCount: 10,
        accountAge: 30
      }
    })
    
    // 重新驗證頁面快取
    revalidatePath('/profile')
    
    return createActionSuccess(updatedProfile, 'Profile updated successfully')
    
  } catch (error) {
    console.error('Profile update error:', error)
    return createActionError('An error occurred while updating profile')
  }
}

// 更新使用者偏好設定
export async function updatePreferencesAction(formData: FormData) {
  try {
    // 使用 DTO mapper 轉換表單資料
    const preferencesRequest = UserRequestMapper.fromFormData(formData, 'preferences')
    
    // 驗證資料
    const validation = validateDTO(userPreferencesSchema, preferencesRequest)
    if (!validation.success) {
      return createValidationError(validation.errors || {})
    }
    
    // 清理資料
    const cleanData = sanitizeDTO(validation.data!)
    
    // 這裡應該更新使用者偏好到資料庫
    console.log('Updating user preferences:', cleanData)
    
    // 模擬回應資料
    const updatedPreferences = UserResponseMapper.toUserPreferences(cleanData)
    
    revalidatePath('/settings')
    
    return createActionSuccess(updatedPreferences, 'Preferences updated successfully')
    
  } catch (error) {
    console.error('Preferences update error:', error)
    return createActionError('An error occurred while updating preferences')
  }
}

// 刪除使用者帳戶
export async function deleteAccountAction(formData: FormData) {
  try {
    const password = formData.get('password') as string
    const reason = formData.get('reason') as string
    const feedback = formData.get('feedback') as string
    
    if (!password) {
      return createActionError('Password is required to delete account')
    }
    
    // 建立刪除請求 DTO
    const deleteRequest = {
      password,
      reason,
      feedback
    }
    
    // 清理資料
    const cleanData = sanitizeDTO(deleteRequest)
    
    // 這裡應該：
    // 1. 驗證密碼
    // 2. 刪除使用者資料
    // 3. 登出使用者
    
    console.log('Deleting user account:', { reason: cleanData.reason })
    
    return createActionSuccess(undefined, 'Account deleted successfully')
    
  } catch (error) {
    console.error('Account deletion error:', error)
    return createActionError('An error occurred while deleting account')
  }
}

// 上傳使用者頭像
export async function uploadAvatarAction(formData: FormData) {
  try {
    const file = formData.get('avatar') as File
    
    if (!file || file.size === 0) {
      return createActionError('Please select a file to upload')
    }
    
    // 驗證檔案類型和大小
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return createActionError('Invalid file type. Please upload a JPEG, PNG, or WebP image.')
    }
    
    if (file.size > maxSize) {
      return createActionError('File size too large. Please upload an image smaller than 5MB.')
    }
    
    // 這裡應該：
    // 1. 上傳檔案到儲存服務
    // 2. 更新使用者頭像 URL
    // 3. 刪除舊頭像檔案
    
    const avatarUrl = `/uploads/avatars/user-1-${Date.now()}.${file.type.split('/')[1]}`
    console.log('Uploading avatar:', { fileName: file.name, size: file.size, url: avatarUrl })
    
    revalidatePath('/profile')
    
    return createActionSuccess({ avatarUrl }, 'Avatar uploaded successfully')
    
  } catch (error) {
    console.error('Avatar upload error:', error)
    return createActionError('An error occurred while uploading avatar')
  }
}

// 匯出使用者資料
export async function exportUserDataAction(formData: FormData) {
  try {
    const format = formData.get('format') as 'json' | 'csv' | 'pdf'
    const includePersonalData = formData.get('includePersonalData') === 'true'
    const includeActivityData = formData.get('includeActivityData') === 'true'
    
    // 建立匯出請求 DTO
    const exportRequest = {
      format: format || 'json',
      includePersonalData,
      includeActivityData
    }
    
    // 這裡應該：
    // 1. 收集使用者資料
    // 2. 根據格式生成檔案
    // 3. 提供下載連結
    
    const exportData = {
      exportId: `export-${Date.now()}`,
      format: exportRequest.format,
      status: 'completed' as const,
      downloadUrl: `/api/exports/user-data-${Date.now()}.${exportRequest.format}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      fileSize: 1024 * 50 // 50KB (模擬)
    }
    
    console.log('Exporting user data:', exportRequest)
    
    return createActionSuccess(exportData, 'Data export completed successfully')
    
  } catch (error) {
    console.error('Data export error:', error)
    return createActionError('An error occurred while exporting data')
  }
}