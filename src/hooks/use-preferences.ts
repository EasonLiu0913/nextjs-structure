'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { type UserPreferencesInput } from '@/schemas/settings-schema'

export function usePreferences() {
  const router = useRouter()
  const pathname = usePathname()

  // Apply language change immediately
  const applyLanguageChange = (language: string) => {
    const currentLocale = pathname.split('/')[1] || 'en'
    
    if (currentLocale !== language) {
      const segments = pathname.split('/')
      segments[1] = language
      const newPath = segments.join('/')
      router.push(newPath)
    }
  }

  // Apply theme change immediately
  const applyThemeChange = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    if (theme === 'system') {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      localStorage.removeItem('theme')
    } else {
      // Use selected theme
      root.classList.add(theme)
      localStorage.setItem('theme', theme)
    }
  }

  // Apply timezone change (for future use with date formatting)
  const applyTimezoneChange = (timezone: string) => {
    // Store timezone in localStorage for client-side date formatting
    localStorage.setItem('timezone', timezone)
  }

  // Apply all preferences immediately
  const applyPreferences = (preferences: UserPreferencesInput) => {
    // Apply language change
    if (preferences.language) {
      applyLanguageChange(preferences.language)
    }

    // Apply theme change
    if (preferences.theme) {
      applyThemeChange(preferences.theme)
    }

    // Apply timezone change
    if (preferences.timezone) {
      applyTimezoneChange(preferences.timezone)
    }

    // Store other preferences in localStorage for immediate access
    localStorage.setItem('emailNotifications', preferences.emailNotifications.toString())
    localStorage.setItem('pushNotifications', preferences.pushNotifications.toString())
    localStorage.setItem('marketingEmails', preferences.marketingEmails.toString())
    localStorage.setItem('profilePublic', preferences.profilePublic.toString())
    localStorage.setItem('showEmail', preferences.showEmail.toString())
    localStorage.setItem('allowMessages', preferences.allowMessages.toString())
  }

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    
    if (savedTheme) {
      applyThemeChange(savedTheme)
    } else {
      // Default to system theme
      applyThemeChange('system')
    }
  }, [])

  return {
    applyLanguageChange,
    applyThemeChange,
    applyTimezoneChange,
    applyPreferences
  }
}