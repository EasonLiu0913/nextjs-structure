'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { userProfileSchema, type UserProfileInput } from '@/schemas/user-schema'
import { updateProfileAction, getUserProfileAction } from '@/actions/user-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FadeIn } from '@/components/ui/animations/fade-in'
import { buttonHover } from '@/lib/animations'
import { useTranslations } from 'next-intl'
import { Loader2, Save } from 'lucide-react'

export function ProfileForm() {
    const t = useTranslations('Profile.form')
    const [serverError, setServerError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm<UserProfileInput>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            bio: '',
            website: '',
            location: ''
        }
    })

    // Load existing user profile data
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setIsLoading(true)
                const result = await getUserProfileAction()
                
                if (result?.success && result.data) {
                    form.reset({
                        name: result.data.name || '',
                        email: result.data.email || '',
                        phone: result.data.phone || '',
                        bio: result.data.bio || '',
                        website: result.data.website || '',
                        location: result.data.location || ''
                    })
                } else if (result?.error) {
                    setServerError(result.error)
                }
            } catch (error) {
                console.error('Failed to load user profile:', error)
                setServerError(t('loadError'))
            } finally {
                setIsLoading(false)
            }
        }

        loadUserProfile()
    }, [form, t])

    const onSubmit = async (data: UserProfileInput) => {
        setServerError(null)
        setSuccessMessage(null)

        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                formData.append(key, value)
            }
        })

        try {
            const result = await updateProfileAction(formData)

            if (result?.error) {
                setServerError(result.error)
                return
            }

            if (result?.fieldErrors) {
                // Clear any existing server error when we have field errors
                setServerError(null)
                
                // Set field-specific errors
                Object.entries(result.fieldErrors).forEach(([field, errors]) => {
                    if (errors && Array.isArray(errors) && errors.length > 0) {
                        form.setError(field as keyof UserProfileInput, {
                            message: errors[0]
                        })
                    }
                })
                return
            }

            if (result?.success) {
                setSuccessMessage(t('updateSuccess'))
                
                // Update form with the returned data if available
                if (result.data) {
                    form.reset({
                        name: result.data.name || '',
                        email: result.data.email || '',
                        phone: result.data.phone || '',
                        bio: result.data.bio || '',
                        website: result.data.website || '',
                        location: result.data.location || ''
                    })
                }
                
                // Clear success message after 5 seconds
                setTimeout(() => setSuccessMessage(null), 5000)
            }
        } catch (error) {
            console.error('Profile update error:', error)
            setServerError(t('unexpectedError'))
        }
    }

    // Show loading state while fetching user data
    if (isLoading) {
        return (
            <div className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-10 w-full bg-muted animate-pulse rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-10 w-full bg-muted animate-pulse rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        <div className="h-10 w-full bg-muted animate-pulse rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-10 w-full bg-muted animate-pulse rounded" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-full bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                    <div className="h-24 w-full bg-muted animate-pulse rounded" />
                </div>
                <div className="flex justify-end">
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                </div>
            </div>
        )
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

                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Alert variant="success">
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <label className="block text-sm font-medium mb-2">
                            {t('name')}
                        </label>
                        <Input
                            {...form.register('name')}
                            type="text"
                            placeholder={t('namePlaceholder')}
                            error={form.formState.errors.name?.message}
                            disabled={form.formState.isSubmitting || isLoading}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label className="block text-sm font-medium mb-2">
                            {t('email')}
                        </label>
                        <Input
                            {...form.register('email')}
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            error={form.formState.errors.email?.message}
                            disabled={form.formState.isSubmitting || isLoading}
                        />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium mb-2">
                            {t('phone')}
                        </label>
                        <Input
                            {...form.register('phone')}
                            type="tel"
                            placeholder={t('phonePlaceholder')}
                            error={form.formState.errors.phone?.message}
                            disabled={form.formState.isSubmitting || isLoading}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label className="block text-sm font-medium mb-2">
                            {t('website')}
                        </label>
                        <Input
                            {...form.register('website')}
                            type="url"
                            placeholder={t('websitePlaceholder')}
                            error={form.formState.errors.website?.message}
                            disabled={form.formState.isSubmitting || isLoading}
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <label className="block text-sm font-medium mb-2">
                        {t('location')}
                    </label>
                    <Input
                        {...form.register('location')}
                        type="text"
                        placeholder={t('locationPlaceholder')}
                        error={form.formState.errors.location?.message}
                        disabled={form.formState.isSubmitting || isLoading}
                    />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <label className="block text-sm font-medium mb-2">
                        {t('bio')}
                    </label>
                    <Textarea
                        {...form.register('bio')}
                        rows={4}
                        placeholder={t('bioPlaceholder')}
                        error={form.formState.errors.bio?.message}
                        disabled={form.formState.isSubmitting || isLoading}
                    />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-end"
                >
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting || isLoading}
                        {...buttonHover}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('saving')}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {t('save')}
                            </>
                        )}
                    </Button>
                </motion.div>
            </form>
        </FadeIn>
    )
}