import type { ModuleConfig } from '@/lib/module-system/types-v2'

export const config: ModuleConfig = {
  // Metadata
  id: 'dev-dashboard',
  name: 'Development Dashboard',
  version: '1.0.0',
  description: 'Dashboard for developers to manage components and access development tools',
  author: 'Platform Team',
  
  // Classification
  type: 'core',
  category: 'development',
  
  // Dependencies
  dependencies: {
    modules: [],
    external: {
      'react': '^18.0.0',
      '@tanstack/react-query': '^5.0.0',
      'lucide-react': '*'
    }
  },
  
  // Permissions
  permissions: [
    'view:components',
    'create:components',
    'view:logs',
    'access:documentation'
  ],
  
  // Features
  features: {
    'component-creation': true,
    'log-viewer': true,
    'quick-actions': true,
    'component-search': false,
    'deployment-triggers': false
  },
  
  // Routes
  routes: {
    main: '/',
    perspective: 'development'
  },
  
  // Navigation
  navigation: [
    {
      id: 'dev-dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/',
      position: 'main',
      perspective: 'development',
      order: 0
    }
  ],
  
  // Dashboard configuration
  dashboard: {
    layout: 'grid',
    defaultView: 'overview',
    refreshInterval: 30000
  },
  
  // Events
  events: {
    subscribe: [
      'component:created',
      'component:updated',
      'deployment:completed',
      'project:changed'
    ],
    publish: [
      'component:viewed',
      'action:triggered',
      'navigation:dashboard'
    ]
  },
  
  // Settings
  settings: {
    schema: {
      componentsPerPage: {
        type: 'number',
        default: 10,
        min: 5,
        max: 50,
        label: 'Components Per Page',
        description: 'Number of components to display in lists'
      },
      showDeprecated: {
        type: 'boolean',
        default: false,
        label: 'Show Deprecated Components',
        description: 'Include deprecated components in listings'
      },
      autoRefresh: {
        type: 'boolean',
        default: true,
        label: 'Auto Refresh',
        description: 'Automatically refresh component data'
      },
      refreshInterval: {
        type: 'select',
        options: [
          { label: '30 seconds', value: 30000 },
          { label: '1 minute', value: 60000 },
          { label: '5 minutes', value: 300000 },
          { label: '10 minutes', value: 600000 }
        ],
        default: 60000,
        label: 'Refresh Interval',
        description: 'How often to refresh data'
      }
    }
  },
  
  // Lifecycle
  lifecycle: {
    onInstall: async (_context) => {
      console.log('Dev Dashboard module installed')
    },
    onActivate: async (_context) => {
      console.log('Dev Dashboard module activated')
    },
    onDeactivate: async (_context) => {
      console.log('Dev Dashboard module deactivated')
    },
    onUpdate: async (_context, fromVersion) => {
      console.log(`Dev Dashboard updated from ${fromVersion} to ${config.version}`)
    }
  }
}