'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'
import { Toaster } from '@/components/ui/toaster'

interface RootProviderProps {
  children: React.ReactNode
}

export function RootProvider({ children }: RootProviderProps) {
  const pathname = usePathname()

  // 頁面瀏覽追蹤
  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return (
    <>
      {children}
      {/* Toast 通知系統 */}
      <Toaster />
      {/* Vercel Analytics */}
      <Analytics />
      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </>
  )
}