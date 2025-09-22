import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Server, 
  Globe, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { usePEMetrics } from '../services/api/queries'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'stable'
  status?: 'success' | 'warning' | 'error'
  gradient?: string
}

function MetricCard({ title, value, subtitle, icon, trend, status, gradient }: MetricCardProps) {
  const statusColors = {
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-rose-500',
  }

  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${gradient || 'bg-gradient-to-r from-blue-500 to-purple-500'}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${gradient ? gradient.replace('bg-gradient', 'bg-gradient').replace('to-r', 'to-br') : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 text-rose-500" />}
            {status && !trend && (
              status === 'success' ? <CheckCircle className="h-3 w-3 text-emerald-500" /> :
              status === 'warning' ? <AlertCircle className="h-3 w-3 text-amber-500" /> :
              <AlertCircle className="h-3 w-3 text-rose-500" />
            )}
            <p className={cn("text-xs", status ? statusColors[status] : "text-muted-foreground")}>
              {subtitle}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MetricsCards() {
  const { data: metrics, isLoading, error } = usePEMetrics()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load metrics</span>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Data Planes"
        value={metrics?.dataPlanes.total || 0}
        subtitle={`${metrics?.dataPlanes.healthy || 0} healthy, ${metrics?.dataPlanes.degraded || 0} degraded`}
        icon={<Server className="h-4 w-4" />}
        status={metrics?.dataPlanes.offline ? 'warning' : 'success'}
        gradient="bg-gradient-to-r from-violet-500 to-purple-500"
      />
      
      <MetricCard
        title="Environments"
        value={metrics?.environments.total || 0}
        subtitle={`${metrics?.environments.active || 0} active, ${metrics?.environments.inactive || 0} inactive`}
        icon={<Globe className="h-4 w-4" />}
        status="success"
        gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
      />
      
      <MetricCard
        title="Users"
        value={metrics?.users.total || 0}
        subtitle={`${metrics?.users.active || 0} active this week`}
        icon={<Users className="h-4 w-4" />}
        trend="up"
        gradient="bg-gradient-to-r from-emerald-500 to-teal-500"
      />
      
      <MetricCard
        title="Components"
        value={metrics?.components.total || 0}
        subtitle={`${metrics?.components.running || 0} running, ${metrics?.components.error || 0} errors`}
        icon={<Package className="h-4 w-4" />}
        status={metrics?.components.error ? 'warning' : 'success'}
        gradient="bg-gradient-to-r from-orange-500 to-red-500"
      />
    </div>
  )
}