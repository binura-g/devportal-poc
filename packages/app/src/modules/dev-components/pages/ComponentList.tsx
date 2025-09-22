import { useState, useMemo } from 'react'
import { useGlobalStore } from '@/stores/global.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useNavigate } from '@tanstack/react-router'
import {
  Package,
  Server,
  Globe,
  Database,
  Search,
  Plus,
  ExternalLink,
  GitBranch,
  Activity,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface ComponentCardProps {
  component: any
  onClick: () => void
}

function ComponentCard({ component, onClick }: ComponentCardProps) {
  const typeIcons = {
    service: <Server className="h-5 w-5" />,
    frontend: <Globe className="h-5 w-5" />,
    backend: <Database className="h-5 w-5" />,
    library: <Package className="h-5 w-5" />
  }

  const typeColors = {
    service: 'bg-blue-100 text-blue-800',
    frontend: 'bg-green-100 text-green-800',
    backend: 'bg-purple-100 text-purple-800',
    library: 'bg-yellow-100 text-yellow-800'
  }

  // Mock data for component health
  const health = Math.random() > 0.2 ? 'healthy' : 'warning'
  const deployments = Math.floor(Math.random() * 10) + 1
  const lastDeployed = '2 hours ago'

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {typeIcons[component.type as keyof typeof typeIcons]}
            <CardTitle className="text-lg">{component.name}</CardTitle>
          </div>
          <Badge className={typeColors[component.type as keyof typeof typeColors]} variant="secondary">
            {component.type}
          </Badge>
        </div>
        <CardDescription className="mt-2">
          {component.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            {health === 'healthy' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-muted-foreground">
              {health === 'healthy' ? 'Healthy' : 'Warning'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {deployments} deployments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {lastDeployed}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              3 contributors
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <Activity className="h-4 w-4 mr-1" />
            Observe
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ComponentList() {
  const { currentProject, getComponentsForProject } = useGlobalStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const navigate = useNavigate()

  const projectComponents = useMemo(() => {
    if (!currentProject) return []
    return getComponentsForProject(currentProject.id)
  }, [currentProject, getComponentsForProject])

  const filteredComponents = useMemo(() => {
    let filtered = projectComponents
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(comp => 
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(comp => comp.type === selectedType)
    }
    
    return filtered
  }, [projectComponents, searchQuery, selectedType])

  const componentTypes = ['service', 'frontend', 'backend', 'library']

  const handleComponentClick = (component: any) => {
    // In a real app, this would navigate to component details
    console.log('Component clicked:', component)
  }

  const handleCreateComponent = () => {
    console.log('Navigating to create component page...')
    navigate({ to: '/components/create' })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Components</h1>
          <p className="text-muted-foreground">
            {currentProject 
              ? `Components for ${currentProject.name}` 
              : 'Select a project to view components'}
          </p>
        </div>
        {currentProject && (
          <Button onClick={handleCreateComponent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Component
          </Button>
        )}
      </div>

      {currentProject ? (
        <>
          {/* Filters and Search */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedType === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                All
              </Button>
              {componentTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>


          {/* Components Grid */}
          {filteredComponents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredComponents.map(component => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onClick={() => handleComponentClick(component)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h2 className="text-xl font-semibold">No Components Found</h2>
                  <p className="text-muted-foreground mt-2">
                    {searchQuery || selectedType 
                      ? 'Try adjusting your filters'
                      : 'Add your first component to get started'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">No Project Selected</h2>
              <p className="text-muted-foreground mt-2">
                Select a project from the dropdown above to view its components
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}