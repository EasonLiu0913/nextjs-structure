'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { createLoginSchema, type LoginInput } from '@/schemas/auth-schema-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
// import { FadeIn } from '@/components/ui/animations/fade-in'
// import { buttonHover } from '@/lib/animations'
import { useTranslations, useLocale } from 'next-intl'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function LoginForm() {
  const t = useTranslations()
  const tLogin = useTranslations('Auth.login')
  const locale = useLocale()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  
  // Create internationalized schema
  const loginSchema = createLoginSchema(t)
  
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Trigger validation on every change
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    
    try {
      // Create locale-aware dashboard URL
      const dashboardUrl = `/${locale}/dashboard`
      
      // Use consistent approach for all browsers but with WebKit-specific handling
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: dashboardUrl
      })
      
      if (result?.error) {
        setServerError('Invalid email or password')
      } else if (result?.ok) {
        // WebKit needs special handling for navigation
        const isWebKit = /AppleWebKit/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent)
        
        if (isWebKit) {
          // For WebKit, wait a bit for session to be established, then force reload
          setTimeout(() => {
            window.location.replace(dashboardUrl)
          }, 100)
        } else if (result.url) {
          // For other browsers, use NextAuth's provided URL
          window.location.href = result.url
        } else {
          // Fallback to manual redirect
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
          
          if (isMobile) {
            window.location.href = dashboardUrl
          } else {
            router.push(dashboardUrl)
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setServerError('An unexpected error occurred')
    }
  }

  return (
    <div className="w-full">
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
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            {tLogin('email')}
          </label>
          <Input
            {...form.register('email')}
            id="email"
            type="email"
            placeholder={tLogin('emailPlaceholder')}
            error={form.formState.errors.email?.message}
            disabled={form.formState.isSubmitting}
          />
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            {tLogin('password')}
          </label>
          <div className="relative">
            <Input
              {...form.register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={tLogin('passwordPlaceholder')}
              error={form.formState.errors.password?.message}
              disabled={form.formState.isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
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
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tLogin('signingIn')}
              </>
            ) : (
              tLogin('signIn')
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
            {tLogin('forgotPassword')}
          </button>
        </motion.div>
      </form>
    </div>
  )
}