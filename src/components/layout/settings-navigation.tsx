'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { 
  User, 
  Settings, 
  Shield, 
  ImageIcon, 
  Database 
} from 'lucide-react'

interface SettingsNavigationProps {
  locale: string
}

export function SettingsNavigation({ locale }: SettingsNavigationProps) {
  const pathname = usePathname()
  const t = useTranslations('Settings')

  const navigationItems = [
    {
      href: `/${locale}/settings`,
      label: t('navigation.profile'),
      icon: User,
      exact: true,
    },
    {
      href: `/${locale}/settings/preferences`,
      label: t('navigation.preferences'),
      icon: Settings,
    },
    {
      href: `/${locale}/settings/security`,
      label: t('navigation.security'),
      icon: Shield,
    },
    {
      href: `/${locale}/settings/avatar`,
      label: t('navigation.avatar'),
      icon: ImageIcon,
    },
    {
      href: `/${locale}/settings/data`,
      label: t('navigation.data'),
      icon: Database,
    },
  ]

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = item.exact 
          ? pathname === item.href
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}