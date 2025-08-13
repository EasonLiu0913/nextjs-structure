import { Card } from '@/components/ui/card'
import { PageTransition } from '@/components/ui/animations/page-transition'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <PageTransition>
          <Card className="p-8">
            {children}
          </Card>
        </PageTransition>
      </div>
    </div>
  )
}