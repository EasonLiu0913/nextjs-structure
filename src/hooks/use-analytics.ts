'use client'

import { useCallback } from 'react'
import { userEvents } from '@/lib/analytics'

export function useAnalytics() {
  const track = useCallback((
    eventName: string,
    properties?: Record<string, string | number | boolean>
  ) => {
    if (typeof window !== 'undefined' && 
        window.va && 
        typeof window.va === 'function') {
      try {
        const safeProperties = properties && typeof properties === 'object' ? properties : {}
        ;(window as any).va('event', eventName, safeProperties)
      } catch (error) {
        console.warn('Analytics tracking failed:', error)
      }
    }
  }, [])

  return {
    track,
    // 便捷方法
    trackLogin: userEvents.login,
    trackLogout: userEvents.logout,
    trackRegister: userEvents.register,
    trackFeatureUsed: userEvents.featureUsed,
    trackButtonClick: userEvents.buttonClicked,
    trackFormStart: userEvents.formStarted,
    trackFormComplete: userEvents.formCompleted,
    trackError: userEvents.errorOccurred
  }
}