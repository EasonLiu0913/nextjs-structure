import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// 支援的語言
export const locales = ['en', 'zh'] as const
export const defaultLocale = 'en' as const

export default getRequestConfig(async ({ locale }) => {
  // 驗證語言是否支援
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})