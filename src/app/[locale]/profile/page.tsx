import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from '@/components/features/profile/profile-form'
import { FadeIn } from '@/components/ui/animations/fade-in'

interface ProfilePageProps {
  params: { locale: string }
}

export default function ProfilePage({ params: { locale } }: ProfilePageProps) {
  const t = useTranslations('Profile')

  return (
    <div className="container mx-auto px-4 py-8">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
      </FadeIn>

      <div className="max-w-2xl mx-auto">
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>{t('personalInfo.title')}</CardTitle>
              <CardDescription>{t('personalInfo.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}