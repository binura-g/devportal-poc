# OpenChoreo Architecture

## Overview

OpenChoreo is a modular developer portal built as a React SPA with a plugin-based architecture supporting both first-party and third-party modules.

## Core Architecture

### Tech Stack
- **React 18 + TypeScript** - Core framework
- **Vite** - Build tool and dev server
- **TanStack Router** - File-based routing (NOT react-router-dom)
- **Zustand** - Global state management
- **React Query** - Server state and data fetching
- **shadcn/ui** - Component library (Radix UI + Tailwind)
- **Tailwind CSS** - Styling system

### Monorepo Structure
```
devportal-poc/
├── packages/
│   └── app/                    # Main application
│       ├── src/
│       │   ├── components/     # Shared UI components
│       │   ├── modules/        # Feature modules
│       │   ├── pages/          # Page components
│       │   ├── routes/         # Route definitions
│       │   ├── stores/         # Global state
│       │   └── lib/            # Utilities
│       └── vite.config.ts
├── turbo.json                  # Turborepo config
└── pnpm-workspace.yaml        # pnpm workspace config
```

## Module System

### Module Structure
Each module follows a flat structure without nested src directories:

```
modules/
├── [module-name]/
│   ├── index.ts         # Public API & exports
│   ├── module.config.ts # Module configuration
│   ├── components/      # React components
│   ├── pages/          # Full page components
│   ├── services/       # API & business logic
│   ├── types/          # TypeScript definitions
│   ├── routes/         # Route definitions
│   └── utils/          # Helper functions
```

### Module Configuration
```typescript
export const config: ModuleConfig = {
  id: 'module-name',
  name: 'Module Display Name',
  version: '1.0.0',
  type: 'core' | 'feature' | 'integration' | 'utility',
  perspective: 'development' | 'platform-engineering' | 'both',
  permissions: ['required:permissions'],
  navigation: [/* nav items */],
  lifecycle: {
    onInstall: async (context) => {},
    onActivate: async (context) => {},
    onDeactivate: async (context) => {}
  }
}
```

## Perspective System

The application supports two perspectives that change the UI and available features:

### Development Perspective
- **Dashboard**: Recent components, quick actions
- **Components**: Component catalog
- **Settings**: Developer preferences

### Platform Engineering Perspective
- **Dashboard**: Infrastructure metrics, enabled modules
- **Infrastructure**: Resource management
- **Security Posture**: Security overview
- **Team Management**: User and team administration
- **Settings**: Platform configuration

## State Management

### Global State (Zustand)
```typescript
interface GlobalState {
  perspective: 'development' | 'platform-engineering'
  currentProject: Project | null
  currentComponent: Component | null
  currentEnvironment: Environment | null
}
```

### Data Flow
```
User Action → Component → Action → Store → State Update → Re-render
                ↓                      ↓
            API Call              Global Context
                ↓                      ↓
          React Query            All Components
```

## Routing Architecture

### TanStack Router Setup
```typescript
// File-based routing
src/routes/
├── __root.tsx          # Root layout
├── index.tsx           # Dashboard (/)
├── components.tsx      # Components page
├── settings.tsx        # Settings page
└── infrastructure.tsx  # Infrastructure (PE only)
```

### Route Guards
Routes can be protected based on perspective and permissions:
```typescript
beforeLoad: ({ context }) => {
  if (context.perspective !== 'platform-engineering') {
    throw new Error('Route not available')
  }
}
```

## Component Architecture

### Layout Structure
```
App
├── Providers
│   ├── QueryClientProvider (React Query)
│   ├── RouterProvider (TanStack Router)
│   └── ThemeProvider (Dark/Light mode)
├── AppLayout
│   ├── TopNav
│   │   ├── Logo
│   │   ├── Project Selector
│   │   ├── Environment Selector
│   │   ├── Search (Cmd+K)
│   │   └── Perspective Switch
│   ├── Sidebar
│   │   └── Navigation (perspective-aware)
│   └── Main Content
│       └── <Outlet /> (route content)
```

### Component Guidelines
- Use shadcn/ui components
- Minimum font size: 13px
- Follow Tailwind conventions
- Implement loading states
- Handle errors gracefully

## Data Layer

### API Architecture
```typescript
// React Query pattern
export function useComponents() {
  return useQuery({
    queryKey: ['components'],
    queryFn: fetchComponents,
    staleTime: 60000,
  })
}
```

### Caching Strategy
- Stale time: 60 seconds for most data
- Cache time: 5 minutes
- Refetch on window focus
- Optimistic updates for mutations

## Third-Party Module Support

### Module Loading
Third-party modules access shared dependencies via global:
```typescript
const { React, UI, Icons, ReactQuery } = window.OpenChoreo
```

### Security Sandbox
- Limited API access
- Permission-based capabilities
- No direct file system access
- Validated inputs/outputs

## Performance Optimizations

1. **Code Splitting**: Dynamic imports for routes
2. **Lazy Loading**: Heavy components loaded on demand
3. **Tree Shaking**: Automatic with Vite
4. **Bundle Optimization**: Separate vendor chunks
5. **Asset Optimization**: Image compression, WebP support

## Build & Deploy

### Build Process
```bash
pnpm build
# Output: dist/ directory with static assets
```

### Deployment
- Static SPA hosting (Vercel, Netlify, S3 + CloudFront)
- No server-side rendering required
- Environment variables injected at build time

## Security Considerations

1. **Authentication**: External auth provider integration ready
2. **Authorization**: Role-based access control (RBAC)
3. **API Security**: Token-based authentication
4. **Content Security Policy**: Configured headers
5. **Input Validation**: All user inputs sanitized

## Future Enhancements

1. **Module Marketplace**: Community modules
2. **Plugin Federation**: Micro-frontend architecture
3. **Real-time Updates**: WebSocket support
4. **Offline Support**: Service worker implementation
5. **AI Integration**: Copilot features