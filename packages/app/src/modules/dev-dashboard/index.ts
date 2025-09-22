/**
 * Development Dashboard Module
 * Main entry point and public API
 */

import { config } from './module.config'

// Import for internal use
import { DevDashboard } from './pages/DevDashboard'

// Public API - Main page component
export { DevDashboard } from './pages/DevDashboard'

// Public API - Components that other modules might use
export { RecentComponents } from './components/RecentComponents'
export { QuickActions } from './components/QuickActions'

// Public API - Hooks for data fetching
export { 
  useComponents,
  useRecentComponents,
  useComponentActivities,
  useComponent,
  useCreateComponent
} from './services/api/queries'

// Public API - Types
export type {
  Component,
  ComponentActivity,
  QuickAction
} from './types/types'

// Module routes (for dynamic loading)
export const routes = {
  base: '/development',
  perspective: 'development',
  children: [
    { path: '/', component: DevDashboard },
    // Additional routes can be added as needed
    // { path: '/components', lazy: () => import('./pages/ComponentsList') },
    // { path: '/components/:id', lazy: () => import('./pages/ComponentDetail') },
  ]
}

// Module registration
export default {
  config,
  routes
}