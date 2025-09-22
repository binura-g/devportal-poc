import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PEMetrics, ModuleStatus, DataPlane } from '../../types/types'

// Mock data generators
const mockMetrics: PEMetrics = {
  dataPlanes: {
    total: 5,
    healthy: 3,
    degraded: 1,
    offline: 1,
  },
  environments: {
    total: 3,
    active: 2,
    inactive: 1,
  },
  users: {
    total: 48,
    active: 42,
    inactive: 6,
  },
  components: {
    total: 24,
    running: 20,
    stopped: 3,
    error: 1,
  },
}

const mockModules: ModuleStatus[] = [
  {
    id: 'ci',
    name: 'CI',
    icon: 'GitBranch',
    enabled: true,
    description: 'Continuous Integration pipelines',
    category: 'ci-cd',
  },
  {
    id: 'cd',
    name: 'CD',
    icon: 'Rocket',
    enabled: true,
    description: 'Continuous Deployment pipelines',
    category: 'ci-cd',
  },
  {
    id: 'observability',
    name: 'Observability',
    icon: 'Activity',
    enabled: true,
    description: 'Monitoring and tracing',
    category: 'observability',
  },
  {
    id: 'secure-vault',
    name: 'Secure Vault',
    icon: 'Lock',
    enabled: false,
    description: 'Secret management',
    category: 'security',
  },
  {
    id: 'api-management',
    name: 'API Management',
    icon: 'Globe',
    enabled: true,
    description: 'API gateway and management',
    category: 'api-management',
  },
]

// Query keys
export const queryKeys = {
  metrics: ['platform-engineering', 'metrics'],
  modules: ['platform-engineering', 'modules'],
  dataPlanes: ['platform-engineering', 'data-planes'],
  environments: ['platform-engineering', 'environments'],
  users: ['platform-engineering', 'users'],
  components: ['platform-engineering', 'components'],
}

// Hooks for data fetching
export function usePEMetrics() {
  return useQuery({
    queryKey: queryKeys.metrics,
    queryFn: async (): Promise<PEMetrics> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockMetrics
    },
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useModuleStatus() {
  return useQuery({
    queryKey: queryKeys.modules,
    queryFn: async (): Promise<ModuleStatus[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockModules
    },
    staleTime: 60000,
  })
}

export function useToggleModule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ moduleId, enabled }: { moduleId: string; enabled: boolean }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return { moduleId, enabled }
    },
    onMutate: async ({ moduleId, enabled }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.modules })
      const previousModules = queryClient.getQueryData<ModuleStatus[]>(queryKeys.modules)
      
      if (previousModules) {
        queryClient.setQueryData<ModuleStatus[]>(queryKeys.modules, old => 
          old?.map(m => m.id === moduleId ? { ...m, enabled } : m) || []
        )
      }
      
      return { previousModules }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousModules) {
        queryClient.setQueryData(queryKeys.modules, context.previousModules)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules })
    },
  })
}

export function useDataPlanes() {
  return useQuery({
    queryKey: queryKeys.dataPlanes,
    queryFn: async (): Promise<DataPlane[]> => {
      await new Promise(resolve => setTimeout(resolve, 400))
      return [
        { id: '1', name: 'US-East-1', status: 'healthy', nodes: 12, region: 'us-east-1', lastSync: '2 mins ago' },
        { id: '2', name: 'EU-West-1', status: 'healthy', nodes: 8, region: 'eu-west-1', lastSync: '1 min ago' },
        { id: '3', name: 'AP-South-1', status: 'degraded', nodes: 6, region: 'ap-south-1', lastSync: '5 mins ago' },
        { id: '4', name: 'US-West-2', status: 'healthy', nodes: 10, region: 'us-west-2', lastSync: '30 secs ago' },
        { id: '5', name: 'EU-Central-1', status: 'offline', nodes: 0, region: 'eu-central-1', lastSync: '15 mins ago' },
      ]
    },
  })
}