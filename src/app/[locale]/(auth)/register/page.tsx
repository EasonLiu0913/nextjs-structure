import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create Account - Next.js Enterprise App',
  description: 'Create your account to get started with our platform.',
}

interface RegisterPageProps {
  params: Promise<{ locale: string }>
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params
  const t = await getTranslations('Auth')

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