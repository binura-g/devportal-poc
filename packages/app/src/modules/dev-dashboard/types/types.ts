export interface Component {
  id: string
  name: string
  description?: string
  type: 'service' | 'library' | 'frontend' | 'backend' | 'api'
  language: string
  framework?: string
  version: string
  status: 'active' | 'deprecated' | 'maintenance' | 'development'
  owner: string
  team: string
  lastUpdated: string
  repository?: string
  documentation?: string
  dependencies?: string[]
  tags?: string[]
}

export interface ComponentActivity {
  componentId: string
  componentName: string
  type: 'commit' | 'deployment' | 'release' | 'update'
  message: string
  author: string
  timestamp: string
  status?: 'success' | 'failed' | 'pending'
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  action: () => void
  variant?: 'default' | 'secondary' | 'ghost' | 'outline'
  category?: 'create' | 'view' | 'manage' | 'help'
}