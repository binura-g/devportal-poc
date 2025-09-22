import { createContext, useContext, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGlobalStore } from '@/stores/global.store'
import type { ModuleContext } from './types'

const ModuleContextInstance = createContext<ModuleContext | null>(null)

export const useModuleContext = () => {
  const context = useContext(ModuleContextInstance)
  if (!context) {
    throw new Error('useModuleContext must be used within ModuleProvider')
  }
  return context
}

interface ModuleProviderProps {
  children: ReactNode
}

export function ModuleProvider({ children }: ModuleProviderProps) {
  const queryClient = useQueryClient()
  const globalStore = useGlobalStore()
  
  const moduleContext: ModuleContext = {
    globalState: {
      perspective: globalStore.perspective,
      currentProject: globalStore.currentProject,
      currentComponent: globalStore.currentComponent,
      currentEnvironment: globalStore.currentEnvironment,
    },
    api: {
      get: async (url: string) => {
        // Mock API implementation - replace with actual API client
        const response = await fetch(url)
        return response.json()
      },
      post: async (url: string, data: any) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        return response.json()
      },
      put: async (url: string, data: any) => {
        const response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        return response.json()
      },
      delete: async (url: string) => {
        const response = await fetch(url, { method: 'DELETE' })
        return response.json()
      },
    },
    queryClient,
    setGlobalState: (updater: any) => {
      // Allow modules to update global state if needed
      if (typeof updater === 'function') {
        const currentState = useGlobalStore.getState()
        const newState = updater(currentState)
        Object.keys(newState).forEach(key => {
          if (key in currentState) {
            (currentState as any)[key] = newState[key]
          }
        })
      }
    },
  }
  
  return (
    <ModuleContextInstance.Provider value={moduleContext}>
      {children}
    </ModuleContextInstance.Provider>
  )
}