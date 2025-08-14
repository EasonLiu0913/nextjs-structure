'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'
import { initializeErrorHandler } from '@/lib/error-handler'
import { Toaster } from '@/components/ui/toaster'

// Import debug utility in development
if (process.env.NODE_ENV === 'development') {
  import('@/lib/analytics-debug')
}

interface RootProviderProps {
  children: React.ReactNode
}

export function RootProvider({ children }: RootProviderProps) {
  const pathname = usePathname()

  // 初始化全域錯誤處理器
  useEffect(() => {
    initializeErrorHandler()
  }, [])

  // 頁面瀏覽追蹤
  useEffect(() => {
    if (pathname) {
      // 延遲執行以確保 analytics 已初始化
      const timer = setTimeout(() => {
        trackPageView(pathname)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [pathname])

  return (
    <>
      {children}
      {/* Toast 通知系統 */}
      <Toaster />
      {/* Vercel Analytics - only in production or when explicitly enabled */}
      {(process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV) && (
        <Analytics debug={process.env.NODE_ENV === 'development'} />
      )}
      {/* Vercel Speed Insights */}
      {(process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV) && (
        <SpeedInsights debug={process.env.NODE_ENV === 'development'} />
      )}
    </>
  )
}