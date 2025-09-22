import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  GitBranch,
  Package,
  Server,
  Layout,
  Library,
  Clock,
  User,
  ArrowRight,
  ExternalLink,
  MoreVertical
} from 'lucide-react'
import { useRecentComponents, useComponentActivities } from '../services/api/queries'
import { cn } from '@/lib/utils'
import type { Component, ComponentActivity } from '../types/types'

const typeIcons: Record<string, React.ReactNode> = {
  service: <Server className="h-4 w-4" />,
  frontend: <Layout className="h-4 w-4" />,
  library: <Library className="h-4 w-4" />,
  backend: <Server className="h-4 w-4" />,
  api: <GitBranch className="h-4 w-4" />
}

const statusColors = {
  active: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  development: 'bg-blue-500/10 text-blue-700 border-blue-200',
  maintenance: 'bg-amber-500/10 text-amber-700 border-amber-200',
  deprecated: 'bg-red-500/10 text-red-700 border-red-200'
}

interface ComponentItemProps {
  component: Component
  activity?: ComponentActivity
}

function ComponentItem({ component, activity }: ComponentItemProps) {
  return (
    <div className="group flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-all hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2 rounded-lg",
          component.status === 'active' 
            ? "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600"
            : "bg-muted text-muted-foreground"
        )}>
          {typeIcons[component.type] || <Package className="h-4 w-4" />}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{component.name}</h4>
            <Badge variant="outline" className={cn("text-xs", statusColors[component.status])}>
              {component.status}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {component.version}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {component.team}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {component.lastUpdated}
            </span>
            {component.language && (
              <Badge variant="outline" className="text-xs">
                {component.language}
              </Badge>
            )}
          </div>
          
          {activity && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="font-medium text-foreground">{activity.type}:</span>
              <span>{activity.message}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ExternalLink className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export function RecentComponents() {
  const { data: components, isLoading, error } = useRecentComponents(8)
  const { data: activities } = useComponentActivities()
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recently Updated Components</CardTitle>
          <CardDescription>Your most recently modified components and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-4 p-4 rounded-lg border">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-48" />
                  </div>
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
      <Card>
        <CardHeader>
          <CardTitle>Recently Updated Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            Failed to load components
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const getActivityForComponent = (componentId: string) => {
    return activities?.find(a => a.componentId === componentId)
  }
  
  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recently Updated Components</CardTitle>
            <CardDescription>Your most recently modified components and services</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="h-3 w-3 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {components?.map((component) => (
            <ComponentItem
              key={component.id}
              component={component}
              activity={getActivityForComponent(component.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}