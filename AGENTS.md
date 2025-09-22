# OpenChoreo Developer Portal - AI Agent Instructions

## Project Overview

OpenChoreo is a modular, extensible developer portal inspired by Backstage, built as a single-page application (SPA) with dual perspectives for Development and Platform Engineering teams.

## Tech Stack

### Core Technologies
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Monorepo**: Turborepo with pnpm workspaces
- **Routing**: TanStack Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Important Notes
- **DO NOT USE**: react-router-dom (we use TanStack Router instead)
- **Minimum Font Size**: 13px throughout the application
- **Default Perspective**: Platform Engineering (PE)

## Project Structure

```
devportal-poc/
├── packages/
│   └── app/                    # Main application
│       ├── src/
│       │   ├── components/      # Shared UI components
│       │   │   ├── layout/     # Layout components (Sidebar, TopNav)
│       │   │   └── ui/         # shadcn/ui components
│       │   ├── modules/        # Modular features
│       │   │   ├── pe-dashboard/     # Platform Engineering dashboard
│       │   │   ├── dev-dashboard/    # Development dashboard  
│       │   │   └── README.md         # Module development guide
│       │   ├── pages/          # Page components
│       │   ├── routes/          # TanStack Router routes
│       │   ├── stores/          # Zustand stores
│       │   ├── lib/            # Utilities and helpers
│       │   └── App.tsx         # Main app component
│       ├── public/
│       ├── package.json
│       └── vite.config.ts
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Module System Architecture

### Module Structure
Each module follows this flat structure:
```
[module-name]/
├── index.ts         # Module entry & public API
├── module.config.ts # Module configuration
├── components/      # React components
├── pages/          # Full page components  
├── services/       # Business logic & APIs
├── types/          # TypeScript types
├── utils/          # Helper functions
└── routes/         # Route definitions
```

### Creating a New Module
1. Create module directory in `src/modules/`
2. Follow the flat structure (no `src/` or `public/` subdirectories)
3. Export public API through `index.ts`
4. Configure module in `module.config.ts`

## Key Components

### Global State (`stores/global.store.ts`)
```typescript
{
  perspective: 'development' | 'platform-engineering'
  currentProject: Project | null
  currentComponent: Component | null
  currentEnvironment: Environment | null
}
```

### Layout Components
- **TopNav**: Project/environment selectors, search (Cmd+K), perspective switcher
- **Sidebar**: Navigation based on current perspective

### Perspective-Based Features

#### Development Perspective
- Dashboard with Recent Components and Quick Actions
- Components view
- Settings

#### Platform Engineering Perspective  
- Dashboard with Metrics, Enabled Modules, Quick Actions
- Infrastructure management
- Security Posture
- Team Management
- Settings

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run type checking
pnpm typecheck

# Lint code
pnpm lint
```

## Routing

Using TanStack Router with file-based routing:
```typescript
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/pages/Dashboard'

export const Route = createFileRoute('/')({
  component: Dashboard,
})
```

## Component Guidelines

### Using shadcn/ui Components
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
```

### Styling with Tailwind
- Use Tailwind utility classes
- Minimum font size: `text-xs` (13px)
- Use `cn()` helper for conditional classes

### Icons
```typescript
import { Settings, Users, Package } from 'lucide-react'
```

## Data Fetching

Using React Query:
```typescript
export function useComponents() {
  return useQuery({
    queryKey: ['components'],
    queryFn: fetchComponents,
    staleTime: 60000,
  })
}
```

## State Management

Using Zustand:
```typescript
const { perspective, setPerspective } = useGlobalStore()
```

## Module Public API

Modules export their public API through `index.ts`:
```typescript
// Public components
export { DashboardComponent } from './pages/Dashboard'

// Public hooks
export { useModuleData } from './services/api/queries'

// Public types
export type { ModuleConfig } from './types'
```

## Best Practices

1. **Module Independence**: Modules should be self-contained
2. **Type Safety**: Use TypeScript strictly
3. **Component Reuse**: Use shared components from `@/components/ui`
4. **Consistent Styling**: Follow Tailwind conventions
5. **Error Handling**: Implement proper error boundaries
6. **Loading States**: Always show loading indicators
7. **Accessibility**: Ensure WCAG compliance
8. **Performance**: Use lazy loading for heavy components

## Common Patterns

### Protected Routes
```typescript
beforeLoad: ({ context }) => {
  if (!context.auth.hasPermission('admin')) {
    throw new Error('Unauthorized')
  }
}
```

### Optimistic Updates
```typescript
useMutation({
  onMutate: async (data) => {
    // Optimistically update cache
    queryClient.setQueryData(['key'], data)
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['key'], context.previousData)
  }
})
```

### Module Registration
```typescript
export default {
  config: moduleConfig,
  routes: moduleRoutes,
  onInstall: async (context) => { /* ... */ },
  onActivate: async (context) => { /* ... */ },
}
```

## Third-Party Module Support

Third-party modules access shared dependencies via `window.OpenChoreo`:
```typescript
const { React, UI, Icons, ReactQuery } = window.OpenChoreo
const { Button, Card } = UI
const { useQuery } = ReactQuery
```

## Testing Strategy

- **Unit Tests**: Components and utilities
- **Integration Tests**: Module interactions
- **E2E Tests**: Critical user flows

## Deployment

- **Build**: `pnpm build`
- **Output**: Static SPA in `dist/`
- **Hosting**: Any static hosting service (Vercel, Netlify, AWS S3, etc.)

## Environment Variables

```env
VITE_API_URL=https://api.example.com
VITE_AUTH_DOMAIN=auth.example.com
VITE_ENVIRONMENT=development
```

## Security Considerations

1. **No secrets in code**: Use environment variables
2. **API validation**: Validate all external data
3. **Permission checks**: Implement RBAC
4. **Content Security Policy**: Configure CSP headers
5. **HTTPS only**: Enforce secure connections

## Performance Optimization

1. **Code splitting**: Use dynamic imports
2. **Tree shaking**: Enabled by default with Vite
3. **Image optimization**: Use WebP format
4. **Bundle analysis**: Use `vite-bundle-visualizer`
5. **Caching**: Implement proper cache headers

## Monitoring & Analytics

- Error tracking with Sentry
- Analytics with PostHog or Plausible
- Performance monitoring with Web Vitals

## Contributing

1. Follow the module structure
2. Write TypeScript with strict mode
3. Include proper documentation
4. Add unit tests for new features
5. Ensure accessibility standards
6. Update this document for significant changes

## Support

For questions or issues:
- Check `/src/modules/README.md` for module development
- Review `/src/modules/ARCHITECTURE.md` for system design
- Refer to component examples in existing modules

## License

[Your License Here]