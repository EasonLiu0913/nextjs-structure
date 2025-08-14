import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SettingsHeader } from '@/components/layout/settings-header'
import { PreferencesClient } from '@/components/features/settings/preferences-client'
import { getUserPreferencesAction } from '@/actions/user-actions'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Settings')
  
  return {
    title: t('preferences.title'),
    description: t('preferences.description'),
  }
}

export default async function PreferencesPage() {
  const t = await getTranslations('Settings')
  
  // 獲取使用者當前偏好設定
  const preferencesResult = await getUserPreferencesAction()
  const initialData = preferencesResult.success ? preferencesResult.data : undefined
  
  return (
    <div className="space-y-6">
      <SettingsHeader 
        title={t('preferences.title')} 
        description={t('preferences.description')} 
      />
      <PreferencesClient initialData={initialData} />
    </div>
  )
}