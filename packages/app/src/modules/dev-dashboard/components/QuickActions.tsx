import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  FileText,
  Terminal,
  Book,
  ArrowRight,
  Package,
  GitBranch,
  Bug,
  Rocket,
  Search,
  Settings,
  HelpCircle
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
  const primaryActions: QuickAction[] = [
    {
      id: 'create-component',
      title: 'Create New Component',
      description: 'Start a new service, library, or frontend app',
      icon: <Plus className="h-4 w-4" />,
      action: () => console.log('Create new component'),
      variant: 'default',
    },
    {
      id: 'view-logs',
      title: 'View Application Logs',
      description: 'Monitor logs and debug issues',
      icon: <Terminal className="h-4 w-4" />,
      action: () => console.log('View logs'),
      variant: 'secondary',
    },
    {
      id: 'read-docs',
      title: 'Read the Docs',
      description: 'Access technical documentation and guides',
      icon: <Book className="h-4 w-4" />,
      action: () => console.log('Read docs'),
      variant: 'secondary',
    }
  ]

  const additionalActions = [
    {
      id: 'browse-catalog',
      icon: <Package className="h-4 w-4" />,
      label: 'Browse Catalog',
      action: () => console.log('Browse catalog')
    },
    {
      id: 'create-branch',
      icon: <GitBranch className="h-4 w-4" />,
      label: 'Create Branch',
      action: () => console.log('Create branch')
    },
    {
      id: 'report-bug',
      icon: <Bug className="h-4 w-4" />,
      label: 'Report Bug',
      action: () => console.log('Report bug')
    },
    {
      id: 'deploy',
      icon: <Rocket className="h-4 w-4" />,
      label: 'Deploy',
      action: () => console.log('Deploy')
    },
    {
      id: 'search',
      icon: <Search className="h-4 w-4" />,
      label: 'Search Code',
      action: () => console.log('Search')
    },
    {
      id: 'settings',
      icon: <Settings className="h-4 w-4" />,
      label: 'Settings',
      action: () => console.log('Settings')
    }
  ]

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common development tasks and tools</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {primaryActions.map((action) => (
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

        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">More Actions</h4>
          <div className="grid grid-cols-3 gap-2">
            {additionalActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={action.action}
              >
                {action.icon}
                <span className="ml-2 text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">Need Help?</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Check out our getting started guide and API documentation
                </p>
                <Button variant="link" className="h-auto p-0 text-xs">
                  View Documentation
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}