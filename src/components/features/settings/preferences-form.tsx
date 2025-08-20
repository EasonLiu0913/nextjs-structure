'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { usePreferences } from '@/hooks/use-preferences'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
// import { Separator } from '@/components/ui/separator'
import { userPreferencesSchema, defaultUserPreferences, type UserPreferencesInput } from '@/schemas/settings-schema'
import { Globe, Moon, Sun, Monitor, Bell, Mail, MessageSquare, Eye, Shield } from 'lucide-react'

interface PreferencesFormProps {
  initialData?: Partial<UserPreferencesInput>
  onSubmit: (data: UserPreferencesInput) => Promise<void>
}

export function PreferencesForm({ initialData, onSubmit }: PreferencesFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('Settings.preferences')
  const { applyThemeChange } = usePreferences()
  
  const form = useForm<UserPreferencesInput>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: {
      ...defaultUserPreferences,
      ...initialData
    }
  })

  // Watch for theme changes and apply immediately for preview
  const watchedTheme = form.watch('theme')
  
  useEffect(() => {
    if (watchedTheme) {
      applyThemeChange(watchedTheme)
    }
  }, [watchedTheme, applyThemeChange])

  const handleSubmit = async (data: UserPreferencesInput) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'zh', label: '中文', flag: '🇹🇼' }
  ]

  const themes = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Monitor }
  ]

  const timezones = [
    { value: 'Asia/Taipei', label: '台北 (GMT+8)' },
    { value: 'Asia/Tokyo', label: '東京 (GMT+9)' },
    { value: 'Asia/Shanghai', label: '上海 (GMT+8)' },
    { value: 'Asia/Hong_Kong', label: '香港 (GMT+8)' },
    { value: 'America/New_York', label: '紐約 (GMT-5)' },
    { value: 'America/Los_Angeles', label: '洛杉磯 (GMT-8)' },
    { value: 'Europe/London', label: '倫敦 (GMT+0)' },
    { value: 'Europe/Paris', label: '巴黎 (GMT+1)' }
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Language & Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('language.title')}
            </CardTitle>
            <CardDescription>
              {t('language.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('language.label')}</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Note: Language change will be applied when form is submitted
                      // to avoid disrupting the user's current form interaction
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('language.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('language.help')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {t('theme.label')}
                    <span className="text-xs text-muted-foreground">({t('theme.preview')})</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('theme.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {themes.map((theme) => {
                        const Icon = theme.icon
                        return (
                          <SelectItem key={theme.value} value={theme.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{theme.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('theme.help')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('timezone.label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('timezone.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('timezone.help')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t('notifications.title')}
            </CardTitle>
            <CardDescription>
              {t('notifications.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t('notifications.email.label')}
                    </FormLabel>
                    <FormDescription>
                      {t('notifications.email.description')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      {t('notifications.push.label')}
                    </FormLabel>
                    <FormDescription>
                      {t('notifications.push.description')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingEmails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t('notifications.marketing.label')}
                    </FormLabel>
                    <FormDescription>
                      {t('notifications.marketing.description')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('privacy.title')}
            </CardTitle>
            <CardDescription>
              {t('privacy.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="profilePublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {t('privacy.profilePublic.label')}
                    </FormLabel>
                    <FormDescription>
                      {t('privacy.profilePublic.description')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="showEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t('privacy.showEmail.label')}
                    </FormLabel>
                    <FormDescription>
                      {t('privacy.showEmail.description')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowMessages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {t('privacy.allowMessages.label')}
                    </FormLabel>
                    <FormDescription>
                      {t('privacy.allowMessages.description')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}