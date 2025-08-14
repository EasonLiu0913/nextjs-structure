import {
    ApiResponse,
    PaginatedResponse,
    createApiResponse,
    createErrorResponse,
    handleApiError,
    isSuccessResponse,
    extractResponseData,
    extractErrorMessage
} from '@/dto'

// API 客戶端配置
interface ApiClientConfig {
    baseUrl: string
    timeout: number
    headers?: Record<string, string>
}

// API 客戶端類別
export class ApiClient {
    private config: ApiClientConfig
    private controller: AbortController | null = null

    constructor(config: ApiClientConfig) {
        this.config = config
    }

    // 設定預設 headers
    private getHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            ...this.config.headers
        }
    }

    // 處理請求
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            // 建立新的 AbortController
            this.controller = new AbortController()

            // 設定超時
            const timeoutId = setTimeout(() => {
                this.controller?.abort()
            }, this.config.timeout)

            const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers
                },
                signal: this.controller.signal
            })

            clearTimeout(timeoutId)

            // 解析回應
            const data = await response.json()

            if (!response.ok) {
                return createErrorResponse(
                    data.message || data.error || 'Request failed',
                    response.status,
                    data
                )
            }

            return createApiResponse(data, true, undefined, response.status)

        } catch (error: any) {
            if (error.name === 'AbortError') {
                return createErrorResponse('Request timeout', 408)
            }

            return handleApiError(error)
        }
    }

    // GET 請求
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint
        return this.request<T>(url, { method: 'GET' })
    }

    // POST 請求
    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        })
    }

    // PUT 請求
    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined
        })
    }

    // PATCH 請求
    async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined
        })
    }

    // DELETE 請求
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' })
    }

    // 上傳檔案
    async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: formData,
            headers: {} // 讓瀏覽器自動設定 Content-Type
        })
    }

    // 取消請求
    cancel(): void {
        this.controller?.abort()
    }

    // 設定認證 token
    setAuthToken(token: string): void {
        this.config.headers = {
            ...this.config.headers,
            Authorization: `Bearer ${token}`
        }
    }

    // 移除認證 token
    removeAuthToken(): void {
        if (this.config.headers) {
            delete this.config.headers.Authorization
        }
    }
}

// 建立預設 API 客戶端實例
export const apiClient = new ApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
    headers: {
        'Accept': 'application/json'
    }
})

// API 回應處理工具
export class ApiResponseHandler {
    // 處理成功回應
    static handleSuccess<T>(response: ApiResponse<T>): T | null {
        if (isSuccessResponse(response)) {
            return extractResponseData(response)
        }
        return null
    }

    // 處理錯誤回應
    static handleError(response: ApiResponse): string {
        return extractErrorMessage(response) || 'Unknown error occurred'
    }

    // 處理分頁回應
    static handlePaginated<T>(response: PaginatedResponse<T>): {
        data: T[]
        pagination: PaginatedResponse<T>['pagination']
    } | null {
        if (isSuccessResponse(response)) {
            return {
                data: response.data || [],
                pagination: response.pagination
            }
        }
        return null
    }

    // 統一錯誤處理
    static async withErrorHandling<T>(
        apiCall: () => Promise<ApiResponse<T>>,
        onError?: (error: string) => void
    ): Promise<T | null> {
        try {
            const response = await apiCall()

            if (isSuccessResponse(response)) {
                return extractResponseData(response)
            } else {
                const errorMessage = this.handleError(response)
                onError?.(errorMessage)
                return null
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            onError?.(errorMessage)
            return null
        }
    }
}

// 重試機制
export class ApiRetryHandler {
    static async withRetry<T>(
        apiCall: () => Promise<ApiResponse<T>>,
        maxRetries = 3,
        delay = 1000
    ): Promise<ApiResponse<T>> {
        let lastError: ApiResponse<T>

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await apiCall()

                if (isSuccessResponse(response)) {
                    return response
                }

                // 如果是客戶端錯誤 (4xx)，不重試
                if (response.code && response.code >= 400 && response.code < 500) {
                    return response
                }

                lastError = response

                if (attempt < maxRetries) {
                    await this.sleep(delay * attempt) // 指數退避
                }
            } catch (error) {
                lastError = handleApiError(error)

                if (attempt < maxRetries) {
                    await this.sleep(delay * attempt)
                }
            }
        }

        return lastError!
    }

    private static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

// 快取機制
export class ApiCache {
    private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

    static set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void { // 預設 5 分鐘
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        })
    }

    static get<T>(key: string): T | null {
        const cached = this.cache.get(key)

        if (!cached) {
            return null
        }

        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key)
            return null
        }

        return cached.data
    }

    static clear(): void {
        this.cache.clear()
    }

    static delete(key: string): void {
        this.cache.delete(key)
    }
}