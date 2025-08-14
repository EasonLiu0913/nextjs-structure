import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// 支援的語言
export const locales = ['en', 'zh'] as const
export const defaultLocale = 'en' as const

export default getRequestConfig(async ({ requestLocale }) => {
  // 獲取語言設定
  const locale = await requestLocale
  
  // 驗證語言是否支援
  if (!locale || !locales.includes(locale as any)) notFound()

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})