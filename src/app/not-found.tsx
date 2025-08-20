import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function GlobalNotFound() {
  // 從 Next.js headers 獲取請求的 URL
  const headersList = await headers()
  const referer = headersList.get('referer') || ''
  const host = headersList.get('host') || ''
  const pathname = headersList.get('x-pathname') || ''
  const url = headersList.get('x-url') || ''
  const nextUrl = headersList.get('x-invoke-path') || ''
  
  // Debug: 打印所有可能相關的 headers
  const debugHeaders = {
    referer,
    host,
    pathname, 
    url,
    nextUrl,
    'x-forwarded-for': headersList.get('x-forwarded-for') || '',
    'user-agent': (headersList.get('user-agent') || '').substring(0, 50) + '...'
  }
  
  console.log('🔍 404 Page Headers:', debugHeaders)
  
  // 嘗試從不同來源檢測語言
  let locale = 'en'
  
  // 方法1: 從 referer 檢測
  if (referer.includes('/zh/')) {
    locale = 'zh'
    console.log('✅ Detected zh from referer:', referer)
  }
  
  // 方法2: 從 pathname 檢測
  if (pathname.includes('/zh/')) {
    locale = 'zh'
    console.log('✅ Detected zh from pathname:', pathname)
  }
  
  // 方法3: 從其他 headers 檢測
  if (url.includes('/zh/') || nextUrl.includes('/zh/')) {
    locale = 'zh'
    console.log('✅ Detected zh from url/nextUrl:', { url, nextUrl })
  }
  
  const isZh = locale === 'zh'
  
  const title = isZh ? '頁面未找到' : 'Page Not Found'
  const description = isZh 
    ? '您要查找的頁面不存在或已被移動。'
    : 'The page you are looking for does not exist or has been moved.'
  const returnHome = isZh ? '返回首頁' : 'Return Home'

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="mb-2 text-xs text-blue-500">
        GLOBAL 404 | Detected Locale: {locale}
      </div>
      <div className="mb-4 text-xs text-gray-400 break-words max-w-md">
        Debug: referer="{referer}", pathname="{pathname}", url="{url}"
      </div>
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold mb-2">404 - {title}</h1>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        {description}
      </p>
      <Button asChild>
        <Link href={`/${locale}`}>
          {returnHome}
        </Link>
      </Button>
    </div>
  )
}