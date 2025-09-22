import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  GitBranch, 
  Rocket, 
  Activity, 
  Lock, 
  Globe,
  Settings,
  CheckCircle,
  XCircle,
  Shield,
  Package,
  Zap,
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react'
import { useModuleStatus } from '../services/api/queries'
import { cn } from '@/lib/utils'
import type { ModuleStatus } from '../types/types'

const iconMap: Record<string, React.ReactNode> = {
  GitBranch: <GitBranch className="h-5 w-5" />,
  Rocket: <Rocket className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
  Lock: <Lock className="h-5 w-5" />,
  Globe: <Globe className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
}

interface ModuleItemProps {
  module: ModuleStatus
}

function ModuleItem({ module }: ModuleItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          module.enabled 
            ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-green-600" 
            : "bg-muted text-muted-foreground"
        )}>
          {iconMap[module.icon] || <Settings className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{module.name}</span>
            {module.enabled ? (
              <Badge variant="default" className="text-xs bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Installed
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                Not Installed
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!module.enabled && module.docsUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
            onClick={() => window.open(module.docsUrl, '_blank')}
          >
            <BookOpen className="h-3 w-3" />
            How to Install
          </Button>
        )}
        {module.enabled && module.docsUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={() => window.open(module.docsUrl, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function EnabledModules() {
  const { data: modules, isLoading, error } = useModuleStatus()

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Platform Modules</CardTitle>
          <CardDescription>Available modules and their installation status</CardDescription>
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
          <CardTitle>Platform Modules</CardTitle>
          <CardDescription>Available modules and their installation status</CardDescription>
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
            <CardTitle>Platform Modules</CardTitle>
            <CardDescription>Available modules and their installation status</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">{enabledCount} / {totalCount} Installed</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {modules?.map((module) => (
            <ModuleItem
              key={module.id}
              module={module}
            />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full text-xs"
            onClick={() => window.open('https://docs.openchoreo.dev/modules', '_blank')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View Module Documentation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}