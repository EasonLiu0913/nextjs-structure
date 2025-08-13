import * as Sentry from '@sentry/nextjs'

// 設定使用者上下文
export function setUserContext(user: {
  id: string
  email?: string
  username?: string
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username
  })
}

// 清除使用者上下文（登出時）
export function clearUserContext() {
  Sentry.setUser(null)
}

// 設定標籤
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value)
}

// 設定額外上下文
export function setContext(key: string, context: Record<string, any>) {
  Sentry.setContext(key, context)
}

// 手動捕獲錯誤
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })
    }
    Sentry.captureException(error)
  })
}

// 捕獲訊息
export function captureMessage(
  message: string, 
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, any>
) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })
    }
    Sentry.captureMessage(message, level)
  })
}

// 性能監控
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({ name, op })
}