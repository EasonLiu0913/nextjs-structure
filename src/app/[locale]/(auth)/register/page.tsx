import { useTranslations } from 'next-intl'
import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'

interface RegisterPageProps {
  params: { locale: string }
}

export default function RegisterPage({ params: { locale } }: RegisterPageProps) {
  const t = useTranslations('Auth')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">{t('register.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('register.subtitle')}
        </p>
      </div>
      
      <RegisterForm />
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t('register.hasAccount')}{' '}
          <Link 
            href={`/${locale}/login`}
            className="font-medium text-primary hover:underline"
          >
            {t('register.signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}