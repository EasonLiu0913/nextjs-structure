import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { SettingsHeader } from '@/components/layout/settings-header'
import { Card, CardContent } from '@/components/ui/card'
import { ProfileForm } from '@/components/features/profile/profile-form'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBoundary } from '@/components/monitoring/error-boundary'
import { Button } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Settings')
  
  return {
    title: t('profile.title'),
    description: t('profile.description'),
  }
}

function ProfileFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

function ProfileErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">
        Failed to load profile settings
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        {error.message}
      </p>
      <Button onClick={resetError} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  )
}

export default async function SettingsPage() {
  const t = await getTranslations('Settings')
  
  return (
    <div className="space-y-6">
      <SettingsHeader 
        title={t('profile.title')} 
        description={t('profile.description')} 
      />
      <Card>
        <CardContent className="p-6">
          <ErrorBoundary fallback={ProfileErrorFallback}>
            <Suspense fallback={<ProfileFormSkeleton />}>
              <ProfileForm />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  )
}