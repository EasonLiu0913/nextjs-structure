import { ReactNode } from 'react'
import { SettingsNavigation } from './settings-navigation'
import { SettingsHeader } from './settings-header'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface SettingsLayoutProps {
  children: ReactNode
  title: string
  description?: string
  locale: string
}

export function SettingsLayout({ 
  children, 
  title, 
  description, 
  locale 
}: SettingsLayoutProps) {
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
            <SettingsHeader title={title} description={description} />
            <Separator />
            <Card>
              <CardContent className="p-6">
                {children}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}