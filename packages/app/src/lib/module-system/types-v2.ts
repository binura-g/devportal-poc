/**
 * Enhanced module system types for OpenChoreo
 * Supports comprehensive module configuration and lifecycle
 */

import { QueryClient } from '@tanstack/react-query'
import { ReactNode, ComponentType } from 'react'

// Module classification
export type ModuleType = 'core' | 'feature' | 'integration' | 'utility'
export type ModuleCategory = 
  | 'platform-engineering' 
  | 'development' 
  | 'analytics' 
  | 'security' 
  | 'infrastructure'
  | 'integrations'
  | 'utilities'

// Perspective types
export type Perspective = 'development' | 'platform-engineering' | 'both'

// Navigation position
export type NavigationPosition = 'main' | 'secondary' | 'settings' | 'footer'

// Settings types
export interface ModuleSettingSchema {
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'json'
  default: any
  label: string
  description?: string
  required?: boolean
  min?: number
  max?: number
  options?: string[] | { label: string; value: any }[]
  validation?: (value: any) => boolean | string
}

// Navigation configuration
export interface NavigationItem {
  id: string
  label: string
  icon?: string | ReactNode
  path: string
  position?: NavigationPosition
  perspective?: Perspective
  order?: number
  badge?: {
    content: string | number
    variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  }
  children?: NavigationItem[]
  permissions?: string[]
}

// Dashboard card configuration
export interface DashboardCardConfig {
  id: string
  component: string | ComponentType<any>
  position?: 'top' | 'middle' | 'bottom' | 'sidebar'
  size?: 'small' | 'medium' | 'large' | 'full'
  perspectives?: Perspective[]
  permissions?: string[]
  order?: number
  refreshInterval?: number
  props?: Record<string, any>
}

// Route configuration
export interface RouteConfig {
  main: string
  children?: string[]
  perspective?: Perspective
  layout?: 'default' | 'full' | 'minimal'
}

// Event system
export interface EventConfig {
  subscribe?: string[]
  publish?: string[]
}

// Module dependencies
export interface DependencyConfig {
  modules?: string[] // Other modules this module depends on
  external?: Record<string, string> // NPM packages with version constraints
}

// Module features (feature flags)
export type FeatureFlags = Record<string, boolean>

// Module lifecycle context
export interface ModuleLifecycleContext {
  moduleId: string
  version: string
  globalState: {
    perspective: Perspective
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
  eventBus: {
    emit: (event: string, data?: any) => void
    on: (event: string, handler: (data?: any) => void) => () => void
  }
  storage: {
    get: (key: string) => any
    set: (key: string, value: any) => void
    remove: (key: string) => void
  }
  settings: {
    get: (key: string) => any
    set: (key: string, value: any) => void
  }
}

// Lifecycle hooks
export interface ModuleLifecycle {
  onInstall?: (context: ModuleLifecycleContext) => Promise<void> | void
  onActivate?: (context: ModuleLifecycleContext) => Promise<void> | void
  onDeactivate?: (context: ModuleLifecycleContext) => Promise<void> | void
  onUninstall?: (context: ModuleLifecycleContext) => Promise<void> | void
  onUpdate?: (context: ModuleLifecycleContext, fromVersion: string) => Promise<void> | void
}

// Main module configuration
export interface ModuleConfig {
  // Metadata
  id: string
  name: string
  version: string
  description?: string
  author?: string
  license?: string
  homepage?: string
  repository?: string
  
  // Classification
  type: ModuleType
  category?: ModuleCategory
  tags?: string[]
  
  // Dependencies and requirements
  dependencies?: DependencyConfig
  permissions?: string[]
  minPlatformVersion?: string
  maxPlatformVersion?: string
  
  // Features and capabilities
  features?: FeatureFlags
  capabilities?: string[] // What this module provides to others
  
  // UI configuration
  routes?: RouteConfig
  navigation?: NavigationItem[]
  dashboard?: {
    cards?: DashboardCardConfig[]
    layout?: 'grid' | 'list' | 'masonry'
    defaultView?: string
    refreshInterval?: number
  }
  
  // Events
  events?: EventConfig
  
  // Settings
  settings?: {
    schema: Record<string, ModuleSettingSchema>
    defaults?: Record<string, any>
  }
  
  // Lifecycle
  lifecycle?: ModuleLifecycle
  
  // Extension points
  extensionPoints?: {
    [key: string]: {
      description: string
      schema?: any
    }
  }
  
  // Custom metadata
  metadata?: Record<string, any>
}

// Module instance (runtime representation)
export interface Module {
  config: ModuleConfig
  status: 'installed' | 'active' | 'inactive' | 'error'
  instance?: any // The actual module instance
  public?: Record<string, any> // Public API exports
  private?: Record<string, any> // Private implementation
  routes?: any[] // Actual route components
  settings?: Record<string, any> // Current settings values
  state?: Record<string, any> // Module state
  error?: Error
}

// Module registry interface
export interface ModuleRegistry {
  modules: Map<string, Module>
  register: (module: Module) => Promise<void>
  unregister: (moduleId: string) => Promise<void>
  get: (moduleId: string) => Module | undefined
  getAll: () => Module[]
  getByType: (type: ModuleType) => Module[]
  getByCategory: (category: ModuleCategory) => Module[]
  getByCapability: (capability: string) => Module[]
  isActive: (moduleId: string) => boolean
  activate: (moduleId: string) => Promise<void>
  deactivate: (moduleId: string) => Promise<void>
  install: (moduleUrl: string) => Promise<Module>
  uninstall: (moduleId: string) => Promise<void>
  update: (moduleId: string, newVersion: string) => Promise<void>
}

// Module loader interface
export interface ModuleLoader {
  load: (moduleUrl: string) => Promise<Module>
  loadFromManifest: (manifest: ModuleManifest) => Promise<Module>
  unload: (moduleId: string) => Promise<void>
  reload: (moduleId: string) => Promise<Module>
  validate: (module: Module) => boolean | string[]
}

// Module manifest for remote loading
export interface ModuleManifest {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  entryPoint: string // URL to module bundle
  integrity?: string // SRI hash for security
  dependencies?: DependencyConfig
  permissions?: string[]
  size?: number // Bundle size in bytes
  updatedAt?: string // ISO date string
  changelog?: string // URL to changelog
}

// Module API for third-party developers
export interface ModuleAPI {
  // Core utilities
  React: any
  ReactDOM: any
  
  // UI components
  UI: {
    components: Record<string, ComponentType<any>>
    hooks: Record<string, Function>
    utils: Record<string, Function>
  }
  
  // Data layer
  Data: {
    useQuery: Function
    useMutation: Function
    queryClient: QueryClient
  }
  
  // State management
  State: {
    useGlobalStore: Function
    createModuleStore: Function
  }
  
  // Platform services
  Services: {
    api: Record<string, Function>
    auth: Record<string, Function>
    navigation: Record<string, Function>
    notifications: Record<string, Function>
    storage: Record<string, Function>
  }
  
  // Event system
  Events: {
    emit: Function
    on: Function
    off: Function
  }
  
  // Utilities
  Utils: Record<string, Function>
  
  // Icons
  Icons: Record<string, ComponentType<any>>
}

// Types are already exported above