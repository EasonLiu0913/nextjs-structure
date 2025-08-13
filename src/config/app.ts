export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'My Next.js App',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  description: 'My Next.js 15 Application',
  version: '1.0.0',
  
  // 支援的語言
  locales: ['en', 'zh'] as const,
  defaultLocale: 'en' as const,
  
  // 功能開關
  features: {
    auth: true,
    analytics: true,
    i18n: true,
  }
} as const