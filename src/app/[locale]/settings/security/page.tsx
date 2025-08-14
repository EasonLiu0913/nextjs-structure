import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SettingsHeader } from '@/components/layout/settings-header'
import { Card, CardContent } from '@/components/ui/card'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Settings')
  
  return {
    title: t('security.title'),
    description: t('security.description'),
  }
}

export default async function SecurityPage() {
  const t = await getTranslations('Settings')
  
  return (
    <div className="space-y-6">
      <SettingsHeader 
        title={t('security.title')} 
        description={t('security.description')} 
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">安全設定內容將在此處實作</p>
        </CardContent>
      </Card>
    </div>
  )
}