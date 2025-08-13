export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  
  // API 版本
  version: 'v1',
  
  // 重試設定
  retry: {
    attempts: 3,
    delay: 1000,
  },
  
  // 端點
  endpoints: {
    auth: '/auth',
    users: '/users',
    health: '/health',
  }
} as const