# Module Structure Template

## Complete Module Structure

```
[module-name]/
├── index.ts              # Module entry, public API & route exports
├── module.config.ts      # Module configuration & metadata
├── README.md            # Module documentation
│
├── components/          # Reusable React components
│   ├── ComponentA/
│   │   ├── index.tsx
│   │   ├── ComponentA.tsx
│   │   ├── ComponentA.test.tsx
│   │   └── ComponentA.styles.ts
│   └── index.ts        # Component exports
│
├── pages/              # Full page components
│   ├── Dashboard.tsx
│   ├── Settings.tsx
│   └── Detail.tsx
│
├── routes/             # Route definitions (if using file-based routing)
│   ├── index.tsx       # Main route
│   ├── $id.tsx        # Dynamic route
│   └── settings.tsx    # Nested route
│
├── services/           # Business logic & API
│   ├── api/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── queries.ts  # React Query hooks
│   └── [service].service.ts
│
├── hooks/              # Custom React hooks
│   ├── useModuleData.ts
│   └── index.ts
│
├── stores/             # State management (if needed)
│   └── module.store.ts
│
├── types/              # TypeScript definitions
│   ├── api.types.ts
│   ├── component.types.ts
│   └── index.ts
│
├── utils/              # Helper functions
│   ├── constants.ts
│   ├── helpers.ts
│   └── validators.ts
│
└── assets/             # Static assets
    ├── icons/
    └── data/
```

## Example index.ts

```typescript
/**
 * Module: Analytics Dashboard
 * Description: Comprehensive analytics and reporting module
 */

import { config } from './module.config'

// ============================================
// PUBLIC API EXPORTS
// ============================================

// Components that other modules can use
export { AnalyticsWidget } from './components/AnalyticsWidget'
export { MetricsCard } from './components/MetricsCard'
export { ChartComponent } from './components/ChartComponent'

// Pages (for direct navigation)
export { AnalyticsDashboard } from './pages/Dashboard'
export { AnalyticsSettings } from './pages/Settings'
export { ReportDetail } from './pages/Detail'

// Hooks for data access
export { 
  useAnalyticsData,
  useMetrics,
  useReports 
} from './services/api/queries'

// Types for external use
export type {
  AnalyticsData,
  MetricConfig,
  Report,
  ChartOptions
} from './types'

// ============================================
// MODULE ROUTES
// ============================================

export const routes = {
  base: '/analytics',
  perspective: 'both', // 'development' | 'platform-engineering' | 'both'
  
  // Route definitions for dynamic loading
  definitions: [
    {
      path: '/',
      component: () => import('./pages/Dashboard'),
      meta: { title: 'Analytics Dashboard' }
    },
    {
      path: '/reports',
      component: () => import('./pages/Reports'),
      meta: { title: 'Reports' }
    },
    {
      path: '/reports/:reportId',
      component: () => import('./pages/ReportDetail'),
      loader: ({ params }) => import('./services/api/queries').then(
        m => m.fetchReport(params.reportId)
      )
    },
    {
      path: '/settings',
      component: () => import('./pages/Settings'),
      meta: { 
        title: 'Analytics Settings',
        requiresPermission: 'analytics:admin'
      }
    }
  ]
}

// ============================================
// MODULE REGISTRATION
// ============================================

export default {
  config,
  routes,
  
  // Lifecycle hooks
  async onInstall(context) {
    console.log('Analytics module installed')
  },
  
  async onActivate(context) {
    // Register routes with main app
    context.router.registerRoutes(routes)
    
    // Add navigation items
    context.navigation.addItems(config.navigation)
    
    // Initialize module services
    await import('./services/analytics.service').then(
      m => m.initializeAnalytics()
    )
  },
  
  async onDeactivate(context) {
    // Cleanup
    context.router.unregisterRoutes(routes.base)
    context.navigation.removeItems(config.navigation)
  },
  
  async onUninstall(context) {
    // Clean up module data
    console.log('Analytics module uninstalled')
  }
}
```

## Example module.config.ts

```typescript
import type { ModuleConfig } from '@/lib/module-system/types-v2'

export const config: ModuleConfig = {
  // Metadata
  id: 'analytics-dashboard',
  name: 'Analytics Dashboard',
  version: '2.0.0',
  description: 'Comprehensive analytics and reporting for your platform',
  author: 'Platform Team',
  license: 'MIT',
  
  // Classification
  type: 'feature',
  category: 'analytics',
  tags: ['analytics', 'reporting', 'dashboards', 'metrics'],
  
  // Dependencies
  dependencies: {
    modules: ['core-auth', 'data-connector'],
    external: {
      'react': '^18.0.0',
      '@tanstack/react-query': '^5.0.0',
      'recharts': '^2.5.0'
    }
  },
  
  // Required permissions
  permissions: [
    'view:analytics',
    'create:reports',
    'export:data',
    'manage:analytics-settings'
  ],
  
  // Navigation items
  navigation: [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart',
      path: '/analytics',
      position: 'main',
      perspective: 'both',
      order: 30,
      children: [
        {
          id: 'analytics-dashboard',
          label: 'Dashboard',
          path: '/analytics',
          icon: 'LayoutDashboard'
        },
        {
          id: 'analytics-reports',
          label: 'Reports',
          path: '/analytics/reports',
          icon: 'FileText'
        },
        {
          id: 'analytics-settings',
          label: 'Settings',
          path: '/analytics/settings',
          icon: 'Settings',
          permissions: ['manage:analytics-settings']
        }
      ]
    }
  ],
  
  // Dashboard cards
  dashboard: {
    cards: [
      {
        id: 'analytics-summary',
        component: 'AnalyticsSummaryCard',
        position: 'top',
        size: 'large',
        perspectives: ['both'],
        refreshInterval: 60000
      },
      {
        id: 'top-metrics',
        component: 'TopMetricsCard',
        position: 'sidebar',
        size: 'medium',
        perspectives: ['development']
      }
    ]
  },
  
  // Feature flags
  features: {
    'advanced-filtering': true,
    'export-pdf': true,
    'real-time-updates': false,
    'ai-insights': false
  },
  
  // Settings schema
  settings: {
    schema: {
      refreshInterval: {
        type: 'number',
        default: 60000,
        min: 10000,
        max: 300000,
        label: 'Data Refresh Interval',
        description: 'How often to refresh analytics data (in milliseconds)'
      },
      defaultTimeRange: {
        type: 'select',
        options: [
          { label: 'Last 24 Hours', value: '24h' },
          { label: 'Last 7 Days', value: '7d' },
          { label: 'Last 30 Days', value: '30d' },
          { label: 'Last 90 Days', value: '90d' }
        ],
        default: '7d',
        label: 'Default Time Range'
      },
      chartTheme: {
        type: 'select',
        options: ['light', 'dark', 'auto'],
        default: 'auto',
        label: 'Chart Theme'
      }
    }
  },
  
  // Events
  events: {
    subscribe: [
      'project:changed',
      'environment:changed',
      'data:updated'
    ],
    publish: [
      'analytics:report-generated',
      'analytics:export-completed',
      'analytics:metric-alert'
    ]
  }
}
```

## Route Patterns

### 1. Static Routes
```typescript
{ path: '/analytics', component: AnalyticsDashboard }
```

### 2. Dynamic Routes
```typescript
{ path: '/analytics/reports/:reportId', component: ReportDetail }
```

### 3. Nested Routes
```typescript
{ 
  path: '/analytics',
  component: AnalyticsLayout,
  children: [
    { path: '/', component: Dashboard },
    { path: '/reports', component: Reports },
    { path: '/settings', component: Settings }
  ]
}
```

### 4. Protected Routes
```typescript
{
  path: '/analytics/admin',
  component: AdminPanel,
  meta: { requiresPermission: 'analytics:admin' }
}
```

### 5. Lazy Loaded Routes
```typescript
{
  path: '/analytics/advanced',
  component: () => import('./pages/AdvancedAnalytics')
}
```

## Best Practices

1. **Route Organization**
   - Keep routes flat when possible
   - Use lazy loading for heavy components
   - Group related routes under a common base path

2. **Component Structure**
   - Export only necessary components in index.ts
   - Keep page components separate from reusable components
   - Co-locate tests with components

3. **Service Layer**
   - All API calls through service layer
   - Use React Query for data fetching
   - Implement proper error handling

4. **Type Safety**
   - Export only public types
   - Use strict TypeScript
   - Define clear interfaces for module API

5. **Performance**
   - Lazy load routes and heavy components
   - Use code splitting effectively
   - Implement proper caching strategies