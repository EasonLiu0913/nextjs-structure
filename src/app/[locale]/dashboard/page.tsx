import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/ui/animations/fade-in'
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard - Next.js Enterprise App',
  description: 'Your personal dashboard with analytics, statistics, and quick actions.',
}

interface DashboardPageProps {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params
  const t = await getTranslations('Dashboard')

  const stats = [
    {
      title: t('stats.users'),
      value: '2,543',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: t('stats.revenue'),
      value: '$45,231',
      change: '+8%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: t('stats.orders'),
      value: '1,234',
      change: '+23%',
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      title: t('stats.activity'),
      value: '89%',
      change: '+5%',
      icon: Activity,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <FadeIn key={stat.title} delay={index * 0.1}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle>{t('recentActivity.title')}</CardTitle>
              <CardDescription>{t('recentActivity.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Activity {item}</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.6}>
          <Card>
            <CardHeader>
              <CardTitle>{t('quickActions.title')}</CardTitle>
              <CardDescription>{t('quickActions.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href={`/${locale}/dashboard/users`} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block">
                  <Users className="h-6 w-6 mb-2 text-blue-600" />
                  <p className="text-sm font-medium">{t('quickActions.users')}</p>
                </Link>
                <Link href={`/${locale}/dashboard/reports`} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block">
                  <BarChart3 className="h-6 w-6 mb-2 text-green-600" />
                  <p className="text-sm font-medium">{t('quickActions.reports')}</p>
                </Link>
                <Link href={`/${locale}/dashboard/analytics`} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block">
                  <TrendingUp className="h-6 w-6 mb-2 text-purple-600" />
                  <p className="text-sm font-medium">{t('quickActions.analytics')}</p>
                </Link>
                <Link href={`/${locale}/dashboard/settings`} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block">
                  <Activity className="h-6 w-6 mb-2 text-orange-600" />
                  <p className="text-sm font-medium">{t('quickActions.settings')}</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}