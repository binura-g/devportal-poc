import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  GitBranch, 
  Rocket, 
  Activity, 
  Lock, 
  Globe,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useModuleStatus, useToggleModule } from '../services/api/queries'
import { cn } from '@/lib/utils'
import type { ModuleStatus } from '../types/types'

const iconMap: Record<string, React.ReactNode> = {
  GitBranch: <GitBranch className="h-5 w-5" />,
  Rocket: <Rocket className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
  Lock: <Lock className="h-5 w-5" />,
  Globe: <Globe className="h-5 w-5" />,
}

interface ModuleItemProps {
  module: ModuleStatus
  onToggle: (moduleId: string, enabled: boolean) => void
  isToggling: boolean
}

function ModuleItem({ module, onToggle, isToggling }: ModuleItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          module.enabled 
            ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-600" 
            : "bg-muted text-muted-foreground"
        )}>
          {iconMap[module.icon] || <Settings className="h-5 w-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{module.name}</span>
            {module.enabled ? (
              <Badge variant="default" className="text-xs">Active</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">Inactive</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </div>
      </div>
      <Switch
        checked={module.enabled}
        onCheckedChange={(checked) => onToggle(module.id, checked)}
        disabled={isToggling}
      />
    </div>
  )
}

export function EnabledModules() {
  const { data: modules, isLoading, error } = useModuleStatus()
  const toggleModule = useToggleModule()

  const handleToggle = (moduleId: string, enabled: boolean) => {
    toggleModule.mutate({ moduleId, enabled })
  }

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enabled Modules</CardTitle>
          <CardDescription>Platform modules and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-32" />
                    </div>
                  </div>
                  <div className="h-6 w-10 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enabled Modules</CardTitle>
          <CardDescription>Platform modules and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            <span>Failed to load modules</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const enabledCount = modules?.filter(m => m.enabled).length || 0
  const totalCount = modules?.length || 0

  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Enabled Modules</CardTitle>
            <CardDescription>Platform modules and their status</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">{enabledCount} / {totalCount} Active</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {modules?.map((module) => (
            <ModuleItem
              key={module.id}
              module={module}
              onToggle={handleToggle}
              isToggling={toggleModule.isPending}
            />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Module Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}