import { ReactNode } from 'react'
import { SettingsNavigation } from '@/components/layout/settings-navigation'
import { Separator } from '@/components/ui/separator'

interface SettingsLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function SettingsLayout({ 
  children, 
  params 
}: SettingsLayoutProps) {
  const { locale } = await params
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/5">
          <div className="sticky top-6">
            <SettingsNavigation locale={locale} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:max-w-2xl">
          <div className="space-y-6">
            <Separator />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}