import { z } from 'zod'

// DTO 驗證函數
export function validateDTO<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string[]>
} {
  try {
    const result = schema.safeParse(data)
    
    if (result.success) {
      return {
        success: true,
        data: result.data
      }
    } else {
      const errors: Record<string, string[]> = {}
      
      result.error.errors.forEach((error) => {
        const path = error.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(error.message)
      })
      
      return {
        success: false,
        errors
      }
    }
  } catch (error) {
    return {
      success: false,
      errors: {
        _general: ['Validation failed']
      }
    }
  }
}

// 資料清理函數
export function sanitizeDTO<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data }
  
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key]
    
    if (typeof value === 'string') {
      // 清理字串：移除前後空白、防止 XSS
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // 遞迴清理物件
      sanitized[key] = sanitizeDTO(value)
    } else if (Array.isArray(value)) {
      // 清理陣列
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) :
        typeof item === 'object' && item !== null ? sanitizeDTO(item) :
        item
      )
    }
  })
  
  return sanitized
}

// 字串清理函數
function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// 深度清理物件，移除 undefined 和 null 值
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {}
  
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedNested = cleanObject(value)
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key as keyof T] = cleanedNested as T[keyof T]
        }
      } else if (Array.isArray(value)) {
        const cleanedArray = value.filter(item => item !== undefined && item !== null)
        if (cleanedArray.length > 0) {
          cleaned[key as keyof T] = cleanedArray as T[keyof T]
        }
      } else {
        cleaned[key as keyof T] = value
      }
    }
  })
  
  return cleaned
}

// 驗證 Email 格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 驗證 URL 格式
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 驗證電話號碼格式
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

// 密碼強度驗證
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Password must be at least 8 characters long')
  }
  
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Password must contain at least one lowercase letter')
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Password must contain at least one uppercase letter')
  }
  
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Password must contain at least one number')
  }
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Password must contain at least one special character')
  }
  
  return {
    isValid: score >= 4,
    score,
    feedback
  }
}

// 資料脫敏函數
export function maskSensitiveData<T extends Record<string, any>>(
  data: T,
  sensitiveFields: string[] = ['password', 'token', 'secret', 'key']
): T {
  const masked = { ...data }
  
  Object.keys(masked).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      masked[key] = '***MASKED***'
    } else if (typeof masked[key] === 'object' && masked[key] !== null && !Array.isArray(masked[key])) {
      masked[key] = maskSensitiveData(masked[key], sensitiveFields)
    }
  })
  
  return masked
}

// 資料類型轉換工具
export function convertTypes<T>(data: any, schema: z.ZodSchema<T>): T {
  // 嘗試轉換常見的類型錯誤
  const converted = { ...data }
  
  Object.keys(converted).forEach(key => {
    const value = converted[key]
    
    // 字串轉布林值
    if (value === 'true') converted[key] = true
    else if (value === 'false') converted[key] = false
    
    // 字串轉數字
    else if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
      converted[key] = Number(value)
    }
  })
  
  return schema.parse(converted)
}