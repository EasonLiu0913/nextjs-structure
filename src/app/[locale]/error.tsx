'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { captureError } from '@/lib/sentry'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 記錄錯誤到 Sentry
    captureError(error, { page: 'locale-error' })
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Something went wrong!</h2>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        We apologize for the inconvenience. An error occurred while loading this page.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Go home
        </Button>
      </div>
    </div>
  )
}