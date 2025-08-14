import { getTranslations } from 'next-intl/server'

interface DocsPageProps {
  params: Promise<{ locale: string }>
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { locale } = await params
  const t = await getTranslations('Footer')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('documentation')}</h1>
        <p className="text-muted-foreground mt-2">產品使用文件和 API 參考</p>
      </div>
      
      <div className="bg-white rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">此頁面正在開發中...</p>
      </div>
    </div>
  )
}