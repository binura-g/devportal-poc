import { useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useGlobalStore } from '@/stores/global.store'

interface QueryParams {
  perspective?: 'development' | 'platform-engineering'
  projectId?: string
  componentId?: string
  environmentId?: string
}

export function useUrlQuerySync() {
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false }) as QueryParams
  const isUpdatingUrl = useRef(false)
  
  const {
    perspective,
    currentProject,
    currentComponent,
    currentEnvironment,
    projects,
    components,
    environments,
    setPerspective,
    setCurrentProject,
    setCurrentComponent,
    setCurrentEnvironment,
  } = useGlobalStore()

  // Update URL when selections change
  const updateUrl = useCallback((updates: Partial<QueryParams>) => {
    isUpdatingUrl.current = true
    const currentSearch = new URLSearchParams(window.location.search)
    
    // Update or remove each parameter
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        currentSearch.set(key, value)
      } else {
        currentSearch.delete(key)
      }
    })

    // Navigate with the new search params, preserving the current path
    const searchObj = Object.fromEntries(currentSearch.entries())
    navigate({
      search: Object.keys(searchObj).length > 0 ? searchObj as any : undefined,
      replace: true, // Don't add to history for selection changes
    })
    
    // Reset flag after navigation
    setTimeout(() => {
      isUpdatingUrl.current = false
    }, 0)
  }, [navigate])

  // Sync store selections to URL
  useEffect(() => {
    // Skip if we're already updating the URL (to prevent loops)
    if (isUpdatingUrl.current) return

    const updates: QueryParams = {
      perspective: perspective,
      projectId: currentProject?.id,
      componentId: currentComponent?.id,
      environmentId: currentEnvironment?.id,
    }

    // Only update if there's a mismatch
    const needsUpdate = 
      searchParams.perspective !== perspective ||
      searchParams.projectId !== currentProject?.id ||
      searchParams.componentId !== currentComponent?.id ||
      searchParams.environmentId !== currentEnvironment?.id

    if (needsUpdate) {
      updateUrl(updates)
    }
  }, [perspective, currentProject, currentComponent, currentEnvironment, searchParams, updateUrl])

  // Sync URL to store on mount and when URL changes externally
  useEffect(() => {
    // Skip if we're programmatically updating the URL
    if (isUpdatingUrl.current) return
    
    // Only run if we have the data loaded
    if (projects.length === 0 || environments.length === 0) return

    // Set perspective from URL
    if (searchParams.perspective && searchParams.perspective !== perspective) {
      setPerspective(searchParams.perspective)
    }

    // Set project from URL
    if (searchParams.projectId) {
      const project = projects.find(p => p.id === searchParams.projectId)
      if (project && project.id !== currentProject?.id) {
        setCurrentProject(project)
      }
    }

    // Set component from URL
    if (searchParams.componentId) {
      const component = components.find(c => c.id === searchParams.componentId)
      if (component && component.id !== currentComponent?.id) {
        setCurrentComponent(component)
      }
    }

    // Set environment from URL
    if (searchParams.environmentId) {
      const environment = environments.find(e => e.id === searchParams.environmentId)
      if (environment && environment.id !== currentEnvironment?.id) {
        setCurrentEnvironment(environment)
      }
    }
  }, [searchParams.perspective, searchParams.projectId, searchParams.componentId, searchParams.environmentId, projects.length, environments.length])

  return {
    updateUrl,
    searchParams,
  }
}

// Hook to get shareable URL
export function useShareableUrl(): string {
  const { perspective, currentProject, currentComponent, currentEnvironment } = useGlobalStore()
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  
  const params = new URLSearchParams()
  params.set('perspective', perspective)
  if (currentProject?.id) params.set('projectId', currentProject.id)
  if (currentComponent?.id) params.set('componentId', currentComponent.id)
  if (currentEnvironment?.id) params.set('environmentId', currentEnvironment.id)
  
  const queryString = params.toString()
  return `${baseUrl}${pathname}${queryString ? `?${queryString}` : ''}`
}