import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  FileText,
  Server,
  ArrowRight,
  Zap,
  Terminal,
  Database,
  Shield
} from 'lucide-react'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  variant?: 'default' | 'secondary' | 'ghost' | 'outline'
}

export function QuickActions() {
  const quickActions: QuickAction[] = [
    {
      id: 'enable-module',
      title: 'Enable New Module',
      description: 'Add a new platform module to your infrastructure',
      icon: <Plus className="h-4 w-4" />,
      action: () => console.log('Enable new module'),
      variant: 'default',
    },
    {
      id: 'view-logs',
      title: 'View Logs',
      description: 'Access centralized logs and monitoring',
      icon: <FileText className="h-4 w-4" />,
      action: () => console.log('View logs'),
      variant: 'secondary',
    },
    {
      id: 'cluster-info',
      title: 'Cluster Information',
      description: 'View detailed cluster status and metrics',
      icon: <Server className="h-4 w-4" />,
      action: () => console.log('View cluster info'),
      variant: 'secondary',
    },
    {
      id: 'run-diagnostics',
      title: 'Run Diagnostics',
      description: 'Execute system health checks',
      icon: <Zap className="h-4 w-4" />,
      action: () => console.log('Run diagnostics'),
      variant: 'outline',
    },
    {
      id: 'terminal',
      title: 'Open Terminal',
      description: 'Access cloud shell environment',
      icon: <Terminal className="h-4 w-4" />,
      action: () => console.log('Open terminal'),
      variant: 'outline',
    },
    {
      id: 'backup',
      title: 'Manage Backups',
      description: 'Configure and restore backups',
      icon: <Database className="h-4 w-4" />,
      action: () => console.log('Manage backups'),
      variant: 'outline',
    },
    {
      id: 'security',
      title: 'Security Scan',
      description: 'Run vulnerability assessment',
      icon: <Shield className="h-4 w-4" />,
      action: () => console.log('Security scan'),
      variant: 'outline',
    },
  ]

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common platform management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {quickActions.slice(0, 3).map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              className="w-full justify-between h-auto py-3 px-4"
              onClick={action.action}
            >
              <div className="flex items-center gap-3">
                <div className={
                  action.variant === 'default' 
                    ? 'p-2 bg-white/20 rounded-lg' 
                    : 'p-2 bg-muted rounded-lg'
                }>
                  {action.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.slice(3).map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={action.action}
              >
                {action.icon}
                <span className="ml-2 text-xs">{action.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}