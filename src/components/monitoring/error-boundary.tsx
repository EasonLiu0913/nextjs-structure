'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 發送錯誤到 Sentry
    Sentry.withScope((scope) => {
      scope.setContext('errorInfo', errorInfo)
      Sentry.captureException(error)
    })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback

      if (FallbackComponent && this.state.error) {
        return (
          <FallbackComponent 
            error={this.state.error} 
            resetError={this.resetError} 
          />
        )
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">出現錯誤</h2>
          <p className="text-gray-600 mb-4 text-center">
            很抱歉，應用程式遇到了問題。我們已經記錄此錯誤並會盡快修復。
          </p>
          <Button onClick={this.resetError}>
            重試
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}