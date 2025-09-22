# OpenChoreo Project State

## Current Implementation Status

### Completed Features

#### Core Infrastructure
- ✅ Monorepo setup with Turborepo and pnpm
- ✅ Vite + React 18 + TypeScript configuration
- ✅ TanStack Router for file-based routing (NOT react-router-dom)
- ✅ Zustand for global state management
- ✅ React Query for data fetching
- ✅ shadcn/ui component library integration
- ✅ Tailwind CSS with 13px minimum font size

#### Module System
- ✅ Flat module structure (no src/ or public/ folders in modules)
- ✅ Module configuration system
- ✅ Dynamic module loading
- ✅ Shared dependencies via window.OpenChoreo

#### Implemented Modules

1. **Dashboard Module** (`/src/modules/dashboard/`)
   - Intelligent switching between PE and Dev dashboards
   - File: `index.tsx` (note: must be .tsx for JSX support)

2. **PE Dashboard Module** (`/src/modules/pe-dashboard/`)
   - Platform metrics overview
   - Enabled modules list with installation status
   - Data planes status
   - No toggle switches - documentation links only

3. **Dev Dashboard Module** (`/src/modules/dev-dashboard/`)
   - Recent components grid
   - Quick actions
   - Activity feed

4. **Components Module** (`/src/modules/components/`)
   - Shared between both perspectives
   - Component list with search and filters
   - Create component wizard (3 steps)
   - Routes: `/components` (list) and `/components/create`

5. **Observability Module** (`/src/modules/observability/`)
   - Logs page with infinite scroll
   - Real-time log streaming simulation
   - Advanced filtering

#### UI/UX Features
- ✅ Dual perspective system (Platform Engineering / Development)
- ✅ Top navigation with project/component/environment selectors
- ✅ Sidebar navigation (perspective-aware)
- ✅ Search with Cmd+K shortcut
- ✅ URL query parameter sync for state
- ✅ Proper scrolling behavior (no sticky nav)
- ✅ Smooth perspective switcher animation

### Navigation Structure

#### Development Perspective
- Dashboard
- Components
- Observability > Logs
- Settings

#### Platform Engineering Perspective
- Dashboard
- Components
- Infrastructure
- Security Posture
- Team Management
- Observability > Logs
- Settings

### Routing Structure
```
/                        # Dashboard (switches based on perspective)
/components             # Components list
/components/create      # Create new component
/observability          # Observability landing
/observability/logs     # Logs viewer
/infrastructure         # PE only
/security-posture       # PE only
/team-management        # PE only
/settings              # Both perspectives
```

### Important Technical Decisions

1. **No pages/ directory** - Everything is in modules
2. **Flat module structure** - No nested src/ in modules
3. **Route structure** - Parent routes use Outlet, index routes for default content
4. **Dashboard module** - Must be .tsx file for JSX support
5. **Font sizing** - Minimum 13px enforced via Tailwind
6. **Scrolling** - Main content scrolls, sidebar/nav fixed height
7. **Component creation** - Uses current project from global state

### Mock Data Structure
- 3 Projects: E-commerce Platform, Analytics Dashboard, Mobile App
- 8 Components across projects
- 3 Environments: Development, Staging, Production
- User Auth Service (replaced API Gateway)

### Known Issues Resolved
- ✅ Fixed infinite rerender loop (route tree generation issue)
- ✅ Fixed dashboard module JSX error (.ts → .tsx)
- ✅ Fixed TypeScript build errors in useUrlQuerySync
- ✅ Fixed nested route navigation for components

### Build & Development Commands
```bash
pnpm dev        # Start dev server (port 3000)
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm typecheck  # Type checking
pnpm lint       # Linting
```

### Environment Configuration
- Development server: http://localhost:3000
- No .env files required for basic operation
- Mock data built into stores

### Future Considerations
1. Real API integration (currently using mock data)
2. Authentication/authorization implementation
3. Module marketplace
4. Real-time updates via WebSocket
5. Offline support

## Session Resume Checklist

When resuming development:
1. Check dev server is running: `pnpm dev`
2. Default perspective: Platform Engineering
3. Test navigation between perspectives
4. Verify component creation flow works
5. Check console for any errors

## Recent Changes (Latest Session)
1. Fixed component creation navigation issue
2. Updated create component form:
   - Left-aligned layout
   - Removed project/org fields (uses global state)
   - Changed title to "Create new Component"
3. Changed API Gateway to User Auth Service in mock data
4. Improved perspective switcher styling
5. Fixed environment selector visibility on dashboard