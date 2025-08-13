'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const { user, isAuthenticated, setUser, logout } = useAuthStore()

  // 同步 NextAuth session 與 Zustand store
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        avatar: session.user.image || undefined
      })
    } else if (status === 'unauthenticated') {
      logout()
    }
  }, [session, status, setUser, logout])

  return {
    user,
    isAuthenticated: status === 'authenticated' && isAuthenticated,
    isLoading: status === 'loading',
    session
  }
}