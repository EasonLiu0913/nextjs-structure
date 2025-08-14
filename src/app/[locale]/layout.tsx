import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AuthSessionProvider } from '@/components/providers/session-provider'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params
  // 驗證語言是否支援
  const locales = ['en', 'zh']
  if (!locales.includes(locale)) {
    notFound()
  }

  // 載入翻譯訊息
  const messages = await getMessages()

  return (
    <AuthSessionProvider>
      <NextIntlClientProvider messages={messages}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </AuthSessionProvider>
  )
}