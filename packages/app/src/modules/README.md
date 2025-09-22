# OpenChoreo Modules

## Quick Start

### Creating a New Module

```bash
# Generate module structure
npx create-module [module-name]

# Or manually create:
mkdir -p modules/[module-name]/{components,pages,services,types,utils}
```

### Module Structure

```
[module-name]/
├── index.ts         # Module entry & public API
├── module.config.ts # Module configuration
├── routes/         # Route definitions (nested routes)
│   ├── index.tsx   # Main route
│   ├── $id.tsx     # Dynamic route (/module/:id)
│   └── settings.tsx # Nested route (/module/settings)
├── components/      # React components
├── pages/          # Full page components  
├── services/       # Business logic & APIs
├── types/          # TypeScript types
├── utils/          # Helper functions
└── README.md       # Module documentation
```

### Required Files

#### `module.config.ts`
```typescript
export const config = {
  id: 'module-name',
  name: 'Module Display Name',
  version: '1.0.0',
  type: 'feature', // core | feature | integration | utility
  permissions: ['required:permission'],
  navigation: [{
    id: 'nav-item',
    label: 'Navigation Label',
    path: '/module-path',
    perspective: 'both' // development | platform-engineering | both
  }]
}
```

#### `index.ts`
```typescript
// Module entry & public API exports
import { config } from './module.config'

// Public API - only export what other modules need
export { MainComponent } from './pages/MainPage'
export { useModuleHook } from './hooks/useModule'
export type { PublicType } from './types'

// Module registration
export default { config }
```

## Module Types

- **core** - Essential platform functionality (auth, routing)
- **feature** - Business features (dashboards, analytics)
- **integration** - Third-party integrations (GitHub, Slack)
- **utility** - Shared tools (data-viz, export)

## Perspectives

Modules can target specific user perspectives:
- **development** - Developer-focused features
- **platform-engineering** - Infrastructure/platform features
- **both** - Available in all perspectives

## Best Practices

1. **Public API** - Export only what's needed in `index.ts`
2. **Dependencies** - List all dependencies in `module.config.ts`
3. **Permissions** - Declare required permissions upfront
4. **Types** - Export only necessary types
5. **Testing** - Test public API thoroughly
6. **Documentation** - Include README with examples

## Module Routes

Modules can define their own routes using TanStack Router conventions:

### Basic Route Structure
```typescript
// routes/index.tsx - Main module route
import { createFileRoute } from '@tanstack/react-router'
import { ModuleDashboard } from '../pages/ModuleDashboard'

export const Route = createFileRoute('/analytics/')({
  component: ModuleDashboard
})
```

### Nested Routes
```typescript
// routes/reports.tsx - /analytics/reports
export const Route = createFileRoute('/analytics/reports')({
  component: ReportsPage
})

// routes/reports.$reportId.tsx - /analytics/reports/:reportId
export const Route = createFileRoute('/analytics/reports/$reportId')({
  component: ReportDetail,
  loader: ({ params }) => fetchReport(params.reportId)
})
```

### Route Registration in module.config.ts
```typescript
export const config = {
  routes: {
    base: '/analytics',
    routes: [
      { path: '/', component: 'AnalyticsDashboard' },
      { path: '/reports', component: 'ReportsList' },
      { path: '/reports/:id', component: 'ReportDetail' },
      { path: '/settings', component: 'AnalyticsSettings' }
    ]
  }
}
```

### Layout Routes
```typescript
// routes/__layout.tsx - Shared layout for module routes
export const Route = createFileRoute('/analytics')({
  component: AnalyticsLayout
})

function AnalyticsLayout() {
  return (
    <div>
      <AnalyticsHeader />
      <Outlet /> {/* Child routes render here */}
    </div>
  )
}
```

### Protected Routes
```typescript
// routes/admin.tsx - Protected admin route
export const Route = createFileRoute('/analytics/admin')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.hasPermission('analytics:admin')) {
      throw new Error('Unauthorized')
    }
  },
  component: AdminPanel
})
```

## Common Patterns

### Data Fetching
```typescript
// services/api/queries.ts
export function useModuleData() {
  return useQuery({
    queryKey: ['module', 'data'],
    queryFn: fetchData
  })
}
```

### Component Structure
```typescript
// components/Component/index.tsx
export { Component } from './Component'
```

### Page Registration
```typescript
// pages/Dashboard/index.tsx
export function Dashboard() {
  // Page component
}
```

## Module Commands

```bash
# Install module
pnpm module:install [module-name]

# Remove module
pnpm module:remove [module-name]

# List modules
pnpm module:list

# Validate module
pnpm module:validate [module-name]
```

## Third-Party Modules

Third-party modules access shared dependencies via `window.OpenChoreo`:

```typescript
const { React, UI, Icons, ReactQuery } = window.OpenChoreo
const { Button, Card } = UI
const { useQuery } = ReactQuery

export function ThirdPartyComponent() {
  return <Button>Third Party</Button>
}
```

## Module Lifecycle

1. **Install** - Module files added
2. **Activate** - Module enabled, routes registered
3. **Deactivate** - Module disabled, routes removed  
4. **Update** - Module version upgraded
5. **Uninstall** - Module completely removed

## Examples

See implemented modules:
- `pe-dashboard/` - Platform engineering dashboard
- `dev-components/` - Development components view

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not loading | Check `module.config.ts` exists |
| Routes not working | Verify perspective settings |
| Missing dependencies | Add to `dependencies` in config |
| Type errors | Export types from `public/index.ts` |