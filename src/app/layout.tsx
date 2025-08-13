import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { RootProvider } from '@/components/providers/root-provider'
import { ErrorBoundary } from '@/components/monitoring/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Enterprise App',
  description: 'A modern Next.js 15 enterprise application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <RootProvider>
            {children}
          </RootProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}