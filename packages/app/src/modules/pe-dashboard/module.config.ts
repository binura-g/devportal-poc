import type { ModuleConfig } from '@/lib/module-system/types-v2'

export const config: ModuleConfig = {
  // Basic metadata
  id: 'pe-dashboard',
  name: 'Platform Engineering Dashboard',
  version: '1.0.0',
  description: 'Dashboard for platform engineering teams to monitor and manage infrastructure',
  author: 'Platform Team',
  
  // Module classification
  type: 'core',
  category: 'platform-engineering',
  
  // Dependencies
  dependencies: {
    modules: [], // No module dependencies yet
    external: {
      'react': '^18.0.0',
      '@tanstack/react-query': '^5.0.0',
      'lucide-react': '*'
    }
  },
  
  // Required permissions
  permissions: [
    'view:platform-metrics',
    'manage:modules',
    'view:infrastructure',
    'execute:platform-actions'
  ],
  
  // Feature flags
  features: {
    'module-management': true,
    'quick-actions': true,
    'real-time-metrics': false,
    'advanced-diagnostics': false
  },
  
  // Routes provided
  routes: {
    main: '/',
    perspective: 'platform-engineering'
  },
  
  // Navigation items
  navigation: [
    {
      id: 'pe-dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/',
      position: 'main',
      perspective: 'platform-engineering',
      order: 0
    }
  ],
  
  // Dashboard configuration
  dashboard: {
    layout: 'grid',
    defaultView: 'overview',
    refreshInterval: 30000
  },
  
  // Event configuration
  events: {
    subscribe: [
      'module:toggled',
      'metrics:updated',
      'infrastructure:changed'
    ],
    publish: [
      'module:enabled',
      'module:disabled',
      'action:executed'
    ]
  },
  
  // Module settings
  settings: {
    schema: {
      metricsRefreshInterval: {
        type: 'number',
        default: 30000,
        min: 10000,
        max: 300000,
        label: 'Metrics Refresh Interval (ms)',
        description: 'How often to refresh platform metrics'
      },
      enabledModulesView: {
        type: 'select',
        options: ['card', 'list', 'compact'],
        default: 'list',
        label: 'Enabled Modules View',
        description: 'How to display enabled modules'
      },
      quickActionsCount: {
        type: 'number',
        default: 3,
        min: 1,
        max: 10,
        label: 'Quick Actions Count',
        description: 'Number of quick actions to show'
      }
    }
  },
  
  // Lifecycle hooks
  lifecycle: {
    onInstall: async (_context) => {
      console.log('PE Dashboard module installed')
    },
    onActivate: async (_context) => {
      console.log('PE Dashboard module activated')
    },
    onDeactivate: async (_context) => {
      console.log('PE Dashboard module deactivated')
    },
    onUpdate: async (_context, fromVersion) => {
      console.log(`PE Dashboard updated from ${fromVersion} to ${config.version}`)
    }
  }
}