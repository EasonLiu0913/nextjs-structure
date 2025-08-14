import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

export function Footer() {
  const t = useTranslations('Footer')
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-xl">NextApp</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('description')}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('product')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/features`} className="text-muted-foreground hover:text-primary">
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-muted-foreground hover:text-primary">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/docs`} className="text-muted-foreground hover:text-primary">
                  {t('documentation')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('company')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/about`} className="text-muted-foreground hover:text-primary">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-muted-foreground hover:text-primary">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/careers`} className="text-muted-foreground hover:text-primary">
                  {t('careers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/privacy`} className="text-muted-foreground hover:text-primary">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-muted-foreground hover:text-primary">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-muted-foreground hover:text-primary">
                  {t('cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} NextApp. {t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}