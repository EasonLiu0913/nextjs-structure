'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { loginSchema, type LoginInput } from '@/schemas/auth-schema'
import { loginAction } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FadeIn } from '@/components/ui/animations/fade-in'
import { buttonHover } from '@/lib/animations'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function LoginForm() {
  const t = useTranslations('Auth.login')
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    
    try {
      const result = await loginAction(formData)
      
      if (result?.error) {
        setServerError(result.error)
      }
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, errors]) => {
          if (errors && Array.isArray(errors) && errors.length > 0) {
            form.setError(field as keyof LoginInput, {
              message: errors[0]
            })
          }
        })
      }
    } catch (error) {
      setServerError('An unexpected error occurred')
    }
  }

  return (
    <FadeIn className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium mb-2">
            {t('email')}
          </label>
          <Input
            {...form.register('email')}
            type="email"
            placeholder={t('emailPlaceholder')}
            error={form.formState.errors.email?.message}
            disabled={form.formState.isSubmitting}
          />
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium mb-2">
            {t('password')}
          </label>
          <div className="relative">
            <Input
              {...form.register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('passwordPlaceholder')}
              error={form.formState.errors.password?.message}
              disabled={form.formState.isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              disabled={form.formState.isSubmitting}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
            {...buttonHover}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('signingIn')}
              </>
            ) : (
              t('signIn')
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            disabled={form.formState.isSubmitting}
          >
            {t('forgotPassword')}
          </button>
        </motion.div>
      </form>
    </FadeIn>
  )
}