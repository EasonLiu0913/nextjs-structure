import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // 伺服器端採樣率
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 伺服器端錯誤過濾
  beforeSend(event) {
    // 過濾敏感資訊
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers?.authorization
    }
    return event
  },
  
  // 環境設定
  environment: process.env.NODE_ENV
})