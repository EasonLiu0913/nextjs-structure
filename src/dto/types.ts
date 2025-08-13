// 基礎 DTO 介面
export interface BaseDTO {
  id?: string
  createdAt?: string
  updatedAt?: string
}

// API 回應包裝器
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: number
}

// 分頁回應
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 表單錯誤
export interface FormErrors {
  [key: string]: string[]
}

// Server Action 回應
export interface ActionResponse<T = any> {
  success?: boolean
  error?: string
  data?: T
  fieldErrors?: FormErrors
}