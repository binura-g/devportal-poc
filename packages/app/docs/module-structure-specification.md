# OpenChoreo Module Structure Specification

## Standard Module Directory Structure

```
modules/
├── [module-name]/
│   ├── package.json              # Module metadata & dependencies
│   ├── README.md                 # Module documentation
│   ├── module.config.ts          # Module configuration & manifest
│   │
│   ├── public/                   # Public API - what other modules can import
│   │   ├── index.ts             # Main public exports
│   │   ├── components.ts        # Exported components
│   │   ├── hooks.ts             # Exported hooks
│   │   ├── types.ts             # Exported types/interfaces
│   │   └── utils.ts             # Exported utilities
│   │
│   ├── src/                      # Internal implementation
│   │   ├── components/          # React components
│   │   │   ├── [Component]/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── [Component].tsx
│   │   │   │   ├── [Component].styles.ts  # Styled components/CSS
│   │   │   │   ├── [Component].test.tsx
│   │   │   │   └── [Component].stories.tsx
│   │   │   └── index.ts        # Internal component exports
│   │   │
│   │   ├── pages/              # Full page components
│   │   │   ├── [PageName]/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/ # Page-specific components
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── use[HookName].ts
│   │   │   └── index.ts
│   │   │
│   │   ├── services/           # Business logic & API calls
│   │   │   ├── api/           # API client & endpoints
│   │   │   │   ├── client.ts
│   │   │   │   ├── endpoints.ts
│   │   │   │   └── queries.ts # React Query hooks
│   │   │   ├── [service-name].service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── stores/            # State management (if needed)
│   │   │   ├── [store-name].store.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/             # Internal utilities
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   ├── validators.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── types/             # Internal types
│   │   │   ├── api.types.ts
│   │   │   ├── component.types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── assets/            # Static assets
│   │       ├── icons/
│   │       ├── images/
│   │       └── data/
│   │
│   ├── routes/                # Route definitions
│   │   ├── index.ts          # Route exports
│   │   └── [route-name].route.ts
│   │
│   ├── locales/              # Internationalization
│   │   ├── en.json
│   │   ├── es.json
│   │   └── index.ts
│   │
│   └── tests/                # Integration/E2E tests
│       ├── integration/
│       └── e2e/

```

## Module Configuration File (module.config.ts)

```typescript
import type { ModuleConfig } from '@/lib/module-system/types'

export const config: ModuleConfig = {
  // Basic metadata
  id: 'analytics-dashboard',
  name: 'Analytics Dashboard',
  version: '1.0.0',
  description: 'Comprehensive analytics and reporting module',
  author: 'Platform Team',
  
  // Module type and category
  type: 'feature', // 'core' | 'feature' | 'integration' | 'utility'
  category: 'analytics', // for grouping in UI
  
  // Dependencies
  dependencies: {
    modules: ['core-auth', 'data-connector'], // Required modules
    external: {
      'react': '^18.0.0',
      '@tanstack/react-query': '^5.0.0'
    }
  },
  
  // Permissions/capabilities required
  permissions: [
    'read:analytics',
    'write:reports',
    'access:sensitive-data'
  ],
  
  // Feature flags
  features: {
    'advanced-filtering': true,
    'export-pdf': false,
    'real-time-updates': true
  },
  
  // Routes this module provides
  routes: {
    main: '/analytics',
    children: [
      '/analytics/dashboard',
      '/analytics/reports',
      '/analytics/settings'
    ]
  },
  
  // Navigation items to add
  navigation: [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart',
      path: '/analytics',
      position: 'main', // 'main' | 'secondary' | 'settings'
      perspective: 'both', // 'development' | 'platform-engineering' | 'both'
      children: [
        {
          id: 'analytics-dashboard',
          label: 'Dashboard',
          path: '/analytics/dashboard'
        },
        {
          id: 'analytics-reports',
          label: 'Reports',
          path: '/analytics/reports'
        }
      ]
    }
  ],
  
  // Dashboard cards this module provides
  dashboard: {
    cards: [
      {
        id: 'analytics-summary',
        component: 'AnalyticsSummaryCard',
        position: 'top',
        size: 'medium',
        perspectives: ['development'],
        permissions: ['read:analytics']
      }
    ]
  },
  
  // Event subscriptions
  events: {
    subscribe: [
      'project:changed',
      'environment:changed',
      'data:updated'
    ],
    publish: [
      'analytics:report-generated',
      'analytics:export-completed'
    ]
  },
  
  // Module settings schema
  settings: {
    schema: {
      refreshInterval: {
        type: 'number',
        default: 60000,
        min: 10000,
        max: 300000,
        label: 'Refresh Interval (ms)'
      },
      defaultView: {
        type: 'select',
        options: ['grid', 'list', 'chart'],
        default: 'grid',
        label: 'Default View'
      }
    }
  },
  
  // Lifecycle hooks
  lifecycle: {
    onInstall: 'installHandler',
    onActivate: 'activateHandler',
    onDeactivate: 'deactivateHandler',
    onUninstall: 'uninstallHandler',
    onUpdate: 'updateHandler'
  }
}
```

## Example Module Implementation

### 1. Public API (public/index.ts)
```typescript
// Only export what other modules should use
export { AnalyticsDashboard } from '../src/pages/Dashboard'
export { AnalyticsWidget } from '../src/components/AnalyticsWidget'
export { useAnalyticsData, useMetrics } from './hooks'
export type { 
  AnalyticsData, 
  MetricConfig, 
  ChartOptions 
} from './types'
```

### 2. Module Entry Point (index.ts)
```typescript
import { config } from './module.config'
import { routes } from './routes'
import * as publicAPI from './public'

// Module registration
export default {
  config,
  routes,
  public: publicAPI,
  
  // Lifecycle implementations
  async install(context) {
    // Initialize module
  },
  
  async activate(context) {
    // Module activated
  },
  
  async deactivate(context) {
    // Module deactivated
  }
}
```

### 3. Service Layer (src/services/api/queries.ts)
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from './client'

export const analyticsKeys = {
  all: ['analytics'] as const,
  metrics: (filters?: any) => [...analyticsKeys.all, 'metrics', filters] as const,
  reports: () => [...analyticsKeys.all, 'reports'] as const,
  report: (id: string) => [...analyticsKeys.all, 'report', id] as const,
}

export function useMetrics(filters?: MetricFilters) {
  return useQuery({
    queryKey: analyticsKeys.metrics(filters),
    queryFn: () => api.getMetrics(filters),
    staleTime: 60 * 1000, // 1 minute
  })
}
```

## Benefits of This Structure

### 1. **Clear Public/Private Separation**
- `public/` - Clear contract for what other modules can use
- `src/` - Internal implementation details
- Prevents accidental coupling to internal implementations

### 2. **Scalability for Teams**
- Each team member can work on isolated components
- Clear ownership boundaries
- Easy to find where things are

### 3. **Type Safety**
- Separate type files for internal vs public types
- Strong typing for module configuration
- Clear API contracts

### 4. **Testing Strategy**
- Component-level tests co-located with components
- Integration tests in dedicated directory
- Easy to maintain test coverage

### 5. **Configuration as Code**
- Single source of truth for module configuration
- Version controlled settings
- Feature flags for gradual rollout

### 6. **Lifecycle Management**
- Clear hooks for module lifecycle events
- Proper cleanup on deactivation
- Migration support for updates

## Module Types

### Core Modules
Essential platform functionality
```
modules/
├── auth/           # Authentication & authorization
├── routing/        # Core routing system
└── data-layer/     # Data access layer
```

### Feature Modules
Business features and functionality
```
modules/
├── analytics-dashboard/
├── deployment-manager/
└── api-gateway/
```

### Integration Modules
Third-party integrations
```
modules/
├── github-integration/
├── slack-notifications/
└── jira-sync/
```

### Utility Modules
Shared utilities and tools
```
modules/
├── data-visualization/
├── export-tools/
└── audit-logger/
```

## Best Practices

1. **Single Responsibility**: Each module should have one clear purpose
2. **Loose Coupling**: Modules communicate through well-defined interfaces
3. **High Cohesion**: Related functionality stays together
4. **Documentation**: Every module must have a README
5. **Versioning**: Follow semantic versioning
6. **Testing**: Minimum 80% test coverage for public APIs
7. **Performance**: Lazy load heavy dependencies
8. **Security**: Validate all inputs, sanitize outputs
9. **Accessibility**: All UI components must be accessible
10. **Internationalization**: Support multiple languages from day one

## Module Development Workflow

1. **Scaffold**: Use CLI to generate module structure
2. **Develop**: Implement features following structure
3. **Test**: Write tests for all public APIs
4. **Document**: Update README and inline docs
5. **Review**: Code review focusing on public API
6. **Publish**: Version and publish module
7. **Monitor**: Track usage and performance metrics