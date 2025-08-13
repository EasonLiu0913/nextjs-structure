import { ApiResponse, PaginatedResponse, ActionResponse } from '../types'

// 建立標準 API 回應
export function createApiResponse<T>(
  data: T,
  success = true,
  message?: string,
  code?: number
): ApiResponse<T> {
  return {
    success,
    data,
    message,
    code
  }
}

// 建立錯誤回應
export function createErrorResponse(
  error: string,
  code = 400,
  data?: any
): ApiResponse {
  return {
    success: false,
    error,
    code,
    data
  }
}

// 建立成功回應
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  code = 200
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    code
  }
}

// 建立分頁回應
export function createPaginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)
  
  return {
    success: true,
    data: items,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

// 建立 Server Action 回應
export function createActionResponse<T>(
  data?: T,
  success = true,
  error?: string,
  fieldErrors?: Record<string, string[]>
): ActionResponse<T> {
  return {
    success,
    data,
    error,
    fieldErrors
  }
}

// 建立 Server Action 成功回應
export function createActionSuccess<T>(
  data?: T,
  message?: string
): ActionResponse<T> {
  return {
    success: true,
    data,
    error: undefined,
    fieldErrors: undefined
  }
}

// 建立 Server Action 錯誤回應
export function createActionError(
  error: string,
  fieldErrors?: Record<string, string[]>
): ActionResponse {
  return {
    success: false,
    error,
    fieldErrors,
    data: undefined
  }
}

// 建立 Server Action 驗證錯誤回應
export function createValidationError(
  fieldErrors: Record<string, string[]>,
  generalError = 'Validation failed'
): ActionResponse {
  return {
    success: false,
    error: generalError,
    fieldErrors,
    data: undefined
  }
}

// 轉換 Zod 錯誤為 field errors
export function zodErrorToFieldErrors(zodError: any): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}
  
  if (zodError.errors) {
    zodError.errors.forEach((error: any) => {
      const path = error.path.join('.')
      if (!fieldErrors[path]) {
        fieldErrors[path] = []
      }
      fieldErrors[path].push(error.message)
    })
  }
  
  return fieldErrors
}

// 處理 API 錯誤回應
export function handleApiError(error: any): ApiResponse {
  if (error.response?.data) {
    return error.response.data
  }
  
  return createErrorResponse(
    error.message || 'An unexpected error occurred',
    error.status || 500
  )
}

// 檢查回應是否成功
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true } {
  return response.success === true
}

// 檢查回應是否為錯誤
export function isErrorResponse(response: ApiResponse): response is ApiResponse & { success: false } {
  return response.success === false
}

// 提取回應資料
export function extractResponseData<T>(response: ApiResponse<T>): T | null {
  return isSuccessResponse(response) ? response.data || null : null
}

// 提取錯誤訊息
export function extractErrorMessage(response: ApiResponse): string {
  return isErrorResponse(response) ? response.error || 'Unknown error' : ''
}