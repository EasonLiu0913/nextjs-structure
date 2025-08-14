import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // 調整採樣率以控制性能影響
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 錯誤過濾
  beforeSend(event, hint) {
    // 過濾掉不重要的錯誤
    if (event.exception) {
      const error = hint.originalException
      if (error && (error as any).message?.includes('Non-Error promise rejection')) {
        return null
      }
    }
    return event
  },
  
  // 環境設定
  environment: process.env.NODE_ENV,
  
  // 使用者隱私
  sendDefaultPii: false
})