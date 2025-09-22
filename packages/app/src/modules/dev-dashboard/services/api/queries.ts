import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Component, ComponentActivity } from '../../types/types'

// Query keys
export const queryKeys = {
  components: ['dev', 'components'] as const,
  recentComponents: ['dev', 'components', 'recent'] as const,
  componentActivities: ['dev', 'activities'] as const,
  component: (id: string) => ['dev', 'component', id] as const,
}

// Mock data
const mockComponents: Component[] = [
  {
    id: '1',
    name: 'User Service',
    description: 'Handles user authentication and management',
    type: 'service',
    language: 'TypeScript',
    framework: 'Express.js',
    version: '2.3.1',
    status: 'active',
    owner: 'john.doe',
    team: 'Platform Team',
    lastUpdated: '2 hours ago',
    repository: 'https://github.com/org/user-service',
    tags: ['auth', 'users', 'core']
  },
  {
    id: '2',
    name: 'Payment Gateway',
    description: 'Integration with payment providers',
    type: 'service',
    language: 'Go',
    framework: 'Gin',
    version: '1.5.0',
    status: 'active',
    owner: 'jane.smith',
    team: 'Payments Team',
    lastUpdated: '1 day ago',
    repository: 'https://github.com/org/payment-gateway',
    tags: ['payments', 'integration']
  },
  {
    id: '3',
    name: 'Admin Dashboard',
    description: 'Administrative interface for system management',
    type: 'frontend',
    language: 'TypeScript',
    framework: 'React',
    version: '3.0.0',
    status: 'active',
    owner: 'alice.johnson',
    team: 'Frontend Team',
    lastUpdated: '3 hours ago',
    repository: 'https://github.com/org/admin-dashboard',
    tags: ['frontend', 'admin', 'react']
  },
  {
    id: '4',
    name: 'Notification Service',
    description: 'Email and push notification service',
    type: 'service',
    language: 'Python',
    framework: 'FastAPI',
    version: '1.2.0',
    status: 'maintenance',
    owner: 'bob.wilson',
    team: 'Infrastructure Team',
    lastUpdated: '5 days ago',
    repository: 'https://github.com/org/notification-service',
    tags: ['notifications', 'email', 'push']
  },
  {
    id: '5',
    name: 'Analytics SDK',
    description: 'Client SDK for analytics tracking',
    type: 'library',
    language: 'JavaScript',
    version: '2.1.0',
    status: 'active',
    owner: 'charlie.brown',
    team: 'Analytics Team',
    lastUpdated: '1 week ago',
    repository: 'https://github.com/org/analytics-sdk',
    tags: ['sdk', 'analytics', 'tracking']
  }
]

const mockActivities: ComponentActivity[] = [
  {
    componentId: '3',
    componentName: 'Admin Dashboard',
    type: 'deployment',
    message: 'Deployed version 3.0.0 to production',
    author: 'alice.johnson',
    timestamp: '30 minutes ago',
    status: 'success'
  },
  {
    componentId: '1',
    componentName: 'User Service',
    type: 'commit',
    message: 'Fix: Improved token validation logic',
    author: 'john.doe',
    timestamp: '2 hours ago'
  },
  {
    componentId: '2',
    componentName: 'Payment Gateway',
    type: 'release',
    message: 'Released v1.5.0 with Stripe integration',
    author: 'jane.smith',
    timestamp: '1 day ago',
    status: 'success'
  },
  {
    componentId: '4',
    componentName: 'Notification Service',
    type: 'update',
    message: 'Updated dependencies to latest versions',
    author: 'bob.wilson',
    timestamp: '3 days ago'
  }
]

// Hooks
export function useComponents() {
  return useQuery({
    queryKey: queryKeys.components,
    queryFn: async (): Promise<Component[]> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockComponents
    },
    staleTime: 60000,
  })
}

export function useRecentComponents(limit: number = 5) {
  return useQuery({
    queryKey: queryKeys.recentComponents,
    queryFn: async (): Promise<Component[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      // Sort by last updated and return limited results
      return [...mockComponents]
        .sort((_a, _b) => {
          // In real app, compare actual timestamps
          return 0
        })
        .slice(0, limit)
    },
    staleTime: 30000,
  })
}

export function useComponentActivities() {
  return useQuery({
    queryKey: queryKeys.componentActivities,
    queryFn: async (): Promise<ComponentActivity[]> => {
      await new Promise(resolve => setTimeout(resolve, 400))
      return mockActivities
    },
    staleTime: 30000,
    refetchInterval: 60000,
  })
}

export function useComponent(id: string) {
  return useQuery({
    queryKey: queryKeys.component(id),
    queryFn: async (): Promise<Component | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockComponents.find(c => c.id === id)
    },
    enabled: !!id,
  })
}

export function useCreateComponent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (component: Partial<Component>) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { ...component, id: Date.now().toString() }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.components })
    },
  })
}