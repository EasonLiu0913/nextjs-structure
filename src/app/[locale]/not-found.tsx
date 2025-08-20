import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

interface NotFoundProps {
  params?: Promise<{ locale?: string }> | { locale?: string }
}

export default async function LocaleNotFound(props: NotFoundProps) {
  // 處理 params 可能是 Promise 的情況
  let locale = 'en'
  
  if (props.params) {
    if (props.params instanceof Promise) {
      const resolvedParams = await props.params
      locale = resolvedParams.locale || 'en'
    } else {
      locale = props.params.locale || 'en'
    }
  }

  // 使用靜態翻譯，避免複雜的 server component 問題
  const translations = {
    en: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or has been moved.',
      returnHome: 'Return Home'
    },
    zh: {
      title: '頁面未找到', 
      description: '您要查找的頁面不存在或已被移動。',
      returnHome: '返回首頁'
    }
  }

  const t = translations[locale as 'en' | 'zh'] || translations.en

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="mb-2 text-xs text-purple-500">LOCALE NOT-FOUND PAGE | Locale: {locale}</div>
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold mb-2">404 - {t.title}</h1>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        {t.description}
      </p>
      <Button asChild>
        <Link href={`/${locale}`}>
          {t.returnHome}
        </Link>
      </Button>
    </div>
  )
}