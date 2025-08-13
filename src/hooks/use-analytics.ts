'use client'

import { useCallback } from 'react'
import { userEvents } from '@/lib/analytics'

export function useAnalytics() {
  const track = useCallback((
    eventName: string,
    properties?: Record<string, string | number | boolean>
  ) => {
    if (typeof window !== 'undefined' && window.va) {
      window.va('track', eventName, properties)
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