'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { userProfileSchema, type UserProfileInput } from '@/schemas/user-schema'
import { updateProfileAction } from '@/actions/user-actions'
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

    const onSubmit = async (data: UserProfileInput) => {
        setServerError(null)
        setSuccessMessage(null)

        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value) formData.append(key, value)
        })

        try {
            const result = await updateProfileAction(formData)

            if (result?.error) {
                setServerError(result.error)
            }
            if (result?.success) {
                setSuccessMessage(result.success)
            }
            if (result?.fieldErrors) {
                Object.entries(result.fieldErrors).forEach(([field, errors]) => {
                    if (errors && Array.isArray(errors) && errors.length > 0) {
                        form.setError(field as keyof UserProfileInput, {
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
                            disabled={form.formState.isSubmitting}
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
                            disabled={form.formState.isSubmitting}
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
                            disabled={form.formState.isSubmitting}
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
                            disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
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