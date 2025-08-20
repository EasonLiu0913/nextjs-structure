'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface UseMobileAuthOptions {
  redirectTo?: string
  requireAuth?: boolean
}

export function useMobileAuth(options: UseMobileAuthOptions = {}) {
  const { redirectTo = '/en/dashboard', requireAuth = false } = options
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [authAttempts, setAuthAttempts] = useState(0)

  useEffect(() => {
    // Detect mobile browser
    const checkMobile = () => {
      const userAgent = navigator.userAgent
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent)
      const isMobileViewport = window.innerWidth < 768
      setIsMobile(isMobileDevice || isMobileViewport)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (status === 'loading') return

    if (requireAuth && status === 'unauthenticated') {
      router.push('/en/login')
      return
    }

    if (status === 'authenticated' && session) {
      // Handle successful authentication
      if (isMobile && authAttempts > 0) {
        // For mobile, use window.location for more reliable redirect
        setTimeout(() => {
          window.location.href = redirectTo
        }, 100)
      }
    }
  }, [status, session, requireAuth, router, redirectTo, isMobile, authAttempts])

  const handleMobileRedirect = (url: string) => {
    setAuthAttempts(prev => prev + 1)
    
    if (isMobile) {
      // Use window.location for mobile browsers
      window.location.href = url
    } else {
      // Use Next.js router for desktop
      router.push(url)
    }
  }

  const retryAuthentication = () => {
    setAuthAttempts(prev => prev + 1)
    
    if (isMobile) {
      // For mobile, try a hard refresh to reset auth state
      window.location.reload()
    } else {
      // For desktop, just navigate to login
      router.push('/en/login')
    }
  }

  return {
    session,
    status,
    isMobile,
    authAttempts,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    handleMobileRedirect,
    retryAuthentication
  }
}

export function getBrowserInfo() {
  if (typeof window === 'undefined') return { isMobile: false, browser: 'unknown' }

  const userAgent = navigator.userAgent
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
  const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)
  const isMobileSafari = isMobile && isSafari

  return {
    isMobile,
    isSafari,
    isMobileSafari,
    browser: isMobileSafari ? 'mobile-safari' : isSafari ? 'safari' : 'other',
    userAgent
  }
}