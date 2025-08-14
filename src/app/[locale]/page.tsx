import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const t = await getTranslations('HomePage')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t('description')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href={`/${locale}/dashboard`}>{t('getStarted')}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${locale}/login`}>{t('learnMore')}</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🚀 {t('features.nextjs.title')}</CardTitle>
              <CardDescription>
                {t('features.nextjs.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('features.nextjs.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎨 {t('features.ui.title')}</CardTitle>
              <CardDescription>
                {t('features.ui.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('features.ui.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔐 {t('features.auth.title')}</CardTitle>
              <CardDescription>
                {t('features.auth.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('features.auth.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🌍 {t('features.i18n.title')}</CardTitle>
              <CardDescription>
                {t('features.i18n.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('features.i18n.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 {t('features.monitoring.title')}</CardTitle>
              <CardDescription>
                {t('features.monitoring.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('features.monitoring.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🧪 {t('features.testing.title')}</CardTitle>
              <CardDescription>
                {t('features.testing.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('features.testing.content')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}