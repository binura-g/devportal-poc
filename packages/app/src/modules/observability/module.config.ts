import { Activity } from 'lucide-react'

export interface ModuleConfig {
  id: string
  name: string
  version: string
  type: 'core' | 'feature' | 'integration' | 'utility'
  perspective: 'development' | 'platform-engineering' | 'both'
  permissions?: string[]
  navigation?: {
    label: string
    icon?: any
    path: string
    children?: {
      label: string
      path: string
    }[]
  }[]
  lifecycle?: {
    onInstall?: (context: any) => Promise<void>
    onActivate?: (context: any) => Promise<void>
    onDeactivate?: (context: any) => Promise<void>
  }
}

export const config: ModuleConfig = {
  id: 'observability',
  name: 'Observability',
  version: '1.0.0',
  type: 'core',
  perspective: 'both',
  permissions: ['logs:read', 'metrics:read', 'traces:read'],
  navigation: [
    {
      label: 'Observability',
      icon: Activity,
      path: '/observability',
      children: [
        {
          label: 'Logs',
          path: '/observability/logs'
        },
        {
          label: 'Metrics',
          path: '/observability/metrics'
        },
        {
          label: 'Traces',
          path: '/observability/traces'
        },
        {
          label: 'Alerts',
          path: '/observability/alerts'
        }
      ]
    }
  ],
  lifecycle: {
    onInstall: async (context) => {
      console.log('Observability module installed', context)
    },
    onActivate: async (context) => {
      console.log('Observability module activated', context)
      // Could initialize monitoring services here
    },
    onDeactivate: async (context) => {
      console.log('Observability module deactivated', context)
      // Could cleanup resources here
    }
  }
}