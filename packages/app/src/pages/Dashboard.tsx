import React from 'react'
import { useGlobalStore } from '@/stores/global.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Users, 
  Server, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Package,
  GitBranch,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  icon: React.ReactNode
}

function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface DeploymentItemProps {
  name: string
  environment: string
  status: 'success' | 'failed' | 'pending'
  time: string
}

function DeploymentItem({ name, environment, status, time }: DeploymentItemProps) {
  const statusIcons = {
    success: <CheckCircle className="h-4 w-4 text-green-500" />,
    failed: <XCircle className="h-4 w-4 text-red-500" />,
    pending: <Clock className="h-4 w-4 text-yellow-500" />
  }

  const envColors = {
    Production: 'bg-green-100 text-green-800',
    Staging: 'bg-yellow-100 text-yellow-800',
    Development: 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        {statusIcons[status]}
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${envColors[environment as keyof typeof envColors] || 'bg-gray-100'}`}>
        {environment}
      </span>
    </div>
  )
}

export function Dashboard() {
  const { currentProject, perspective, components, currentEnvironment } = useGlobalStore()

  // Mock data - in real app, this would come from API based on currentProject
  const mockMetrics = {
    activeServices: 12,
    activeUsers: 1234,
    serverUtilization: '68%',
    activeIncidents: 3,
  }

  const recentDeployments = [
    { name: 'API Gateway v2.1.0', environment: 'Production', status: 'success' as const, time: '2 hours ago' },
    { name: 'Product Service v1.5.3', environment: 'Staging', status: 'pending' as const, time: '3 hours ago' },
    { name: 'Web Frontend v3.0.1', environment: 'Development', status: 'success' as const, time: '5 hours ago' },
    { name: 'Order Service v1.2.0', environment: 'Production', status: 'failed' as const, time: '6 hours ago' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {currentProject 
            ? `Overview for ${currentProject.name}` 
            : 'Select a project to view metrics'}
          {currentEnvironment && ` - ${currentEnvironment.name}`}
        </p>
      </div>

      {currentProject ? (
        <>
          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Active Services"
              value={mockMetrics.activeServices}
              change="+2 from last week"
              trend="up"
              icon={<Package className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Active Users"
              value={mockMetrics.activeUsers.toLocaleString()}
              change="+12% from last month"
              trend="up"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Server Utilization"
              value={mockMetrics.serverUtilization}
              change="-5% from yesterday"
              trend="down"
              icon={<Server className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Active Incidents"
              value={mockMetrics.activeIncidents}
              change="2 resolved today"
              trend="down"
              icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {/* Content Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Deployments */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Deployments</CardTitle>
                <CardDescription>Latest deployment activities across environments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {recentDeployments.map((deployment, i) => (
                    <DeploymentItem key={i} {...deployment} />
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View all deployments
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Gateway</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">99.9%</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">98.5%</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Message Queue</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">95.2%</span>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">89.3%</span>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CDN</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">100%</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <GitBranch className="h-4 w-4 mr-2" />
                  New Deployment
                </Button>
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Add Component
                </Button>
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  View Metrics
                </Button>
                <Button variant="outline" size="sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Create Incident
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">No Project Selected</h2>
              <p className="text-muted-foreground mt-2">
                Select a project from the dropdown above to view its dashboard
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}