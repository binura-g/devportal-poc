import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Perspective = 'development' | 'platform-engineering'

export interface Project {
  id: string
  name: string
  description?: string
  icon?: string
}

export interface Component {
  id: string
  name: string
  projectId: string
  type: 'service' | 'library' | 'frontend' | 'backend'
  description?: string
}

export interface Environment {
  id: string
  name: string
  type: 'development' | 'staging' | 'production'
  projectId?: string
  color?: string
}

interface GlobalState {
  // Current selections
  perspective: Perspective
  currentProject: Project | null
  currentComponent: Component | null
  currentEnvironment: Environment | null
  
  // Available data
  projects: Project[]
  components: Component[]
  environments: Environment[]
  
  // Actions
  setPerspective: (perspective: Perspective) => void
  setCurrentProject: (project: Project | null) => void
  setCurrentComponent: (component: Component | null) => void
  setCurrentEnvironment: (environment: Environment | null) => void
  
  // Data management
  setProjects: (projects: Project[]) => void
  setComponents: (components: Component[]) => void
  setEnvironments: (environments: Environment[]) => void
  
  // Helpers
  getComponentsForProject: (projectId: string) => Component[]
  getEnvironmentsForProject: (projectId: string) => Environment[]
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // Initial state
      perspective: 'platform-engineering',
      currentProject: null,
      currentComponent: null,
      currentEnvironment: null,
      
      // Mock data for development
      projects: [
        { id: 'proj-1', name: 'E-Commerce Platform', description: 'Main e-commerce application' },
        { id: 'proj-2', name: 'Analytics Dashboard', description: 'Business intelligence platform' },
        { id: 'proj-3', name: 'Mobile App', description: 'Customer mobile application' },
      ],
      
      components: [
        { id: 'comp-1', name: 'API Gateway', projectId: 'proj-1', type: 'backend' },
        { id: 'comp-2', name: 'Product Service', projectId: 'proj-1', type: 'service' },
        { id: 'comp-3', name: 'Order Service', projectId: 'proj-1', type: 'service' },
        { id: 'comp-4', name: 'Web Frontend', projectId: 'proj-1', type: 'frontend' },
        { id: 'comp-5', name: 'Analytics API', projectId: 'proj-2', type: 'backend' },
        { id: 'comp-6', name: 'Dashboard UI', projectId: 'proj-2', type: 'frontend' },
        { id: 'comp-7', name: 'iOS App', projectId: 'proj-3', type: 'frontend' },
        { id: 'comp-8', name: 'Android App', projectId: 'proj-3', type: 'frontend' },
      ],
      
      environments: [
        { id: 'env-1', name: 'Development', type: 'development', color: 'blue' },
        { id: 'env-2', name: 'Staging', type: 'staging', color: 'yellow' },
        { id: 'env-3', name: 'Production', type: 'production', color: 'green' },
      ],
      
      // Actions
      setPerspective: (perspective) => set({ perspective }),
      
      setCurrentProject: (project) => {
        set({ 
          currentProject: project,
          // Reset component when project changes
          currentComponent: null 
        })
      },
      
      setCurrentComponent: (component) => set({ currentComponent: component }),
      setCurrentEnvironment: (environment) => set({ currentEnvironment: environment }),
      
      // Data management
      setProjects: (projects) => set({ projects }),
      setComponents: (components) => set({ components }),
      setEnvironments: (environments) => set({ environments }),
      
      // Helpers
      getComponentsForProject: (projectId) => {
        return get().components.filter(c => c.projectId === projectId)
      },
      
      getEnvironmentsForProject: (_projectId) => {
        // For now, all environments are available for all projects
        // Later this can be filtered based on project-specific environments
        return get().environments
      },
    }),
    {
      name: 'global-store',
      partialize: (state) => ({
        perspective: state.perspective,
        currentProject: state.currentProject,
        currentComponent: state.currentComponent,
        currentEnvironment: state.currentEnvironment,
      }),
    }
  )
)