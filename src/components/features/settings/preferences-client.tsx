'use client'

// import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PreferencesForm } from './preferences-form'
import { updateUserPreferencesAction } from '@/actions/user-actions'
import { toast } from '@/hooks/use-toast'
import { usePreferences } from '@/hooks/use-preferences'
import { type UserPreferencesInput } from '@/schemas/settings-schema'

interface PreferencesClientProps {
  initialData?: Partial<UserPreferencesInput>
}

export function PreferencesClient({ initialData }: PreferencesClientProps) {
  const t = useTranslations('Settings.preferences')
  const { applyPreferences } = usePreferences()
  
  const handleSubmit = async (data: UserPreferencesInput) => {
    try {
      // Apply preferences immediately for better UX
      applyPreferences(data)
      
      // Then save to server
      const result = await updateUserPreferencesAction(data)
      
      if (result.success) {
        toast({
          title: t('updateSuccess'),
          description: t('updateSuccess'),
        })
      } else {
        toast({
          title: t('updateError'),
          description: result.error || t('unexpectedError'),
          variant: 'destructive',
        })
        
        // If server update failed, we might want to revert the changes
        // For now, we'll just show the error
      }
    } catch (error) {
      toast({
        title: t('updateError'),
        description: t('unexpectedError'),
        variant: 'destructive',
      })
    }
  }
  
  return (
    <PreferencesForm 
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  )
}