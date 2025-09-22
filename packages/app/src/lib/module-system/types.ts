import { QueryClient } from '@tanstack/react-query'
import { ReactNode, ComponentType, LazyExoticComponent } from 'react'

export type ModuleType = 'core' | 'feature' | 'third-party'

export interface ModuleContext {
  globalState: {
    perspective: 'development' | 'platform-engineering'
    currentProject: any | null
    currentComponent: any | null
    currentEnvironment: any | null
  }
  api: {
    get: (url: string) => Promise<any>
    post: (url: string, data: any) => Promise<any>
    put: (url: string, data: any) => Promise<any>
    delete: (url: string) => Promise<any>
  }
  queryClient: QueryClient
  setGlobalState: (updater: any) => void
}

export interface RouteDefinition {
  path: string
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>
  perspective?: 'development' | 'platform-engineering' | 'all'
}

export interface DashboardCard {
  id: string
  component: ComponentType<any>
  gridSpan?: number
  order?: number
}

export interface NavigationItem {
  id: string
  label: string
  icon?: ReactNode
  path: string
  perspective?: 'development' | 'platform-engineering' | 'all'
}

export interface Module {
  id: string
  name: string
  version: string
  type: ModuleType
  
  // Lifecycle hooks
  init?: (context: ModuleContext) => Promise<void>
  destroy?: () => Promise<void>
  
  // Module exports
  routes?: RouteDefinition[]
  dashboard?: {
    cards?: DashboardCard[]
  }
  navigation?: NavigationItem[]
  
  // Configuration
  config?: Record<string, any>
  dependencies?: string[]
  permissions?: string[]
}

export interface ModuleRegistry {
  modules: Map<string, Module>
  register: (module: Module) => void
  unregister: (moduleId: string) => void
  get: (moduleId: string) => Module | undefined
  getAll: () => Module[]
  getByType: (type: ModuleType) => Module[]
}

export interface ModuleManifest {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  entryPoint: string // URL to the module's JS bundle
  dependencies?: {
    [key: string]: string // External dependencies the module expects
  }
  permissions?: string[] // Permissions the module requires
}