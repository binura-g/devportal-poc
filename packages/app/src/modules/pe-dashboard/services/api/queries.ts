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
    id: 'secure-core',
    name: 'Choreo Secure Core (Cilium)',
    icon: 'Shield',
    enabled: true,
    description: 'Network security and service mesh',
    category: 'security',
    docsUrl: 'https://docs.openchoreo.dev/modules/secure-core',
  },
  {
    id: 'cd-addon',
    name: 'CD Add-On',
    icon: 'Rocket',
    enabled: false,
    description: 'Continuous deployment automation',
    category: 'devops',
    docsUrl: 'https://docs.openchoreo.dev/modules/cd-addon',
  },
  {
    id: 'ci-addon',
    name: 'CI Add-On',
    icon: 'GitBranch',
    enabled: false,
    description: 'Continuous integration pipelines',
    category: 'devops',
    docsUrl: 'https://docs.openchoreo.dev/modules/ci-addon',
  },
  {
    id: 'observability',
    name: 'Observability Add-On',
    icon: 'Activity',
    enabled: true,
    description: 'Monitoring, logging, and tracing',
    category: 'observability',
    docsUrl: 'https://docs.openchoreo.dev/modules/observability',
  },
  {
    id: 'api-gateways',
    name: 'API Gateways',
    icon: 'Globe',
    enabled: false,
    description: 'API management and gateway services',
    category: 'api-management',
    docsUrl: 'https://docs.openchoreo.dev/modules/api-gateways',
  },
  {
    id: 'automation-pipelines',
    name: 'Automation Pipelines',
    icon: 'Settings',
    enabled: false,
    description: 'Workflow automation and orchestration',
    category: 'automation',
    docsUrl: 'https://docs.openchoreo.dev/modules/automation',
  },
  {
    id: 'scale-to-zero',
    name: 'Scale-to-Zero',
    icon: 'Rocket',
    enabled: false,
    description: 'Serverless auto-scaling capabilities',
    category: 'infrastructure',
    docsUrl: 'https://docs.openchoreo.dev/modules/scale-to-zero',
  },
  {
    id: 'governance-security',
    name: 'Governance & Security',
    icon: 'Lock',
    enabled: false,
    description: 'Policy enforcement and compliance',
    category: 'security',
    docsUrl: 'https://docs.openchoreo.dev/modules/governance',
  },
  {
    id: 'container-registry',
    name: 'Container Registry',
    icon: 'Package',
    enabled: false,
    description: 'Private container image storage',
    category: 'infrastructure',
    docsUrl: 'https://docs.openchoreo.dev/modules/registry',
  },
  {
    id: 'secret-vault',
    name: 'Secret Vault',
    icon: 'Lock',
    enabled: false,
    description: 'Secure secrets management',
    category: 'security',
    docsUrl: 'https://docs.openchoreo.dev/modules/secret-vault',
  },
  {
    id: 'ai-gateway',
    name: 'AI Gateway',
    icon: 'Zap',
    enabled: false,
    description: 'AI/ML model serving gateway',
    category: 'ai',
    docsUrl: 'https://docs.openchoreo.dev/modules/ai-gateway',
  },
  {
    id: 'ai-addon',
    name: 'AI Add-On',
    icon: 'Sparkles',
    enabled: false,
    description: 'AI/ML platform capabilities',
    category: 'ai',
    docsUrl: 'https://docs.openchoreo.dev/modules/ai-addon',
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