import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  loading?: boolean
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, description, icon, trend, loading, ...props }, ref) => {
    if (loading) {
      return (
        <Card ref={ref} className={cn(className)} {...props}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            {icon && <div className="h-4 w-4 bg-muted animate-pulse rounded" />}
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      )
    }

    return (
      <Card ref={ref} className={cn(className)} {...props}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {trend && (
              <Badge 
                variant={trend.isPositive ? 'success' : 'destructive'}
                className="text-xs"
              >
                {trend.isPositive ? '+' : ''}{trend.value}
              </Badge>
            )}
            {description && <span>{description}</span>}
          </div>
        </CardContent>
      </Card>
    )
  }
)
StatsCard.displayName = 'StatsCard'

export { StatsCard }