export interface DataPlane {
  id: string
  name: string
  status: 'healthy' | 'degraded' | 'offline'
  nodes: number
  region: string
  lastSync: string
}

export interface Environment {
  id: string
  name: string
  type: 'development' | 'staging' | 'production'
  status: 'active' | 'inactive'
  resources: {
    cpu: number
    memory: number
    storage: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  lastActive: string
}

export interface Component {
  id: string
  name: string
  type: 'service' | 'library' | 'frontend' | 'backend'
  status: 'running' | 'stopped' | 'error'
  version: string
}

export interface ModuleStatus {
  id: string
  name: string
  icon: string
  enabled: boolean
  description: string
  category: 'ci-cd' | 'observability' | 'security' | 'api-management' | 'other'
}

export interface PEMetrics {
  dataPlanes: {
    total: number
    healthy: number
    degraded: number
    offline: number
  }
  environments: {
    total: number
    active: number
    inactive: number
  }
  users: {
    total: number
    active: number
    inactive: number
  }
  components: {
    total: number
    running: number
    stopped: number
    error: number
  }
}