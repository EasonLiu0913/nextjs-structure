import { useTranslations } from 'next-intl'
import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'

interface LoginPageProps {
  params: { locale: string }
}

export default function LoginPage({ params: { locale } }: LoginPageProps) {
  const t = useTranslations('Auth')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">{t('login.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('login.subtitle')}
        </p>
      </div>
      
      <LoginForm />
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t('login.noAccount')}{' '}
          <Link 
            href={`/${locale}/register`}
            className="font-medium text-primary hover:underline"
          >
            {t('login.signUp')}
          </Link>
        </p>
      </div>
    </div>
  )
}