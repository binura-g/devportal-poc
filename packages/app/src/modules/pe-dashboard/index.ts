/**
 * PE Dashboard Module
 * Main entry point and public API
 */

import { config } from './module.config'

// Import for internal use
import { PEDashboard } from './pages/PEDashboard'

// Public API - Main page component
export { PEDashboard } from './pages/PEDashboard'

// Public API - Components that other modules might use
export { MetricsCards } from './components/MetricsCards'
export { EnabledModules } from './components/EnabledModules'
export { QuickActions } from './components/QuickActions'

// Public API - Hooks for data fetching
export { 
  usePEMetrics,
  useModuleStatus,
  useToggleModule,
  useDataPlanes 
} from './services/api/queries'

// Public API - Types that other modules might need
export type {
  PEMetrics,
  ModuleStatus,
  DataPlane,
  Environment,
  User,
  Component
} from './types/types'

// Module routes (for dynamic loading)
export const routes = {
  base: '/platform-engineering',
  perspective: 'platform-engineering',
  children: [
    { path: '/', component: PEDashboard },
    // Additional routes will be added as pages are created
    // { path: '/metrics', lazy: () => import('./pages/MetricsDetail') },
    // { path: '/modules', lazy: () => import('./pages/ModulesManagement') },
    // { path: '/modules/:id', lazy: () => import('./pages/ModuleDetail') },
    // { path: '/settings', lazy: () => import('./pages/Settings') }
  ]
}

// Export module configuration for registration
export default {
  config,
  routes
}