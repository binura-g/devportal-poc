import React from 'react'
import { useLocation } from '@tanstack/react-router'
import { TopNav } from '@/components/layout/TopNav'
import { Sidebar } from '@/components/layout/Sidebar'

// Routes that should hide certain selectors
const routeConfig: Record<string, { showComponent?: boolean; showEnvironment?: boolean }> = {
  '/': { showComponent: false, showEnvironment: false },
  '/components': { showComponent: false, showEnvironment: false },
  '/deployments': { showComponent: true, showEnvironment: true },
  '/monitoring': { showComponent: true, showEnvironment: true },
  '/logs': { showComponent: true, showEnvironment: true },
  '/security': { showComponent: false, showEnvironment: false },
  '/api-docs': { showComponent: true, showEnvironment: false },
  '/infrastructure': { showComponent: false, showEnvironment: true },
  '/platform-services': { showComponent: false, showEnvironment: true },
  '/ci-cd': { showComponent: true, showEnvironment: true },
  '/observability': { showComponent: true, showEnvironment: true },
  '/security-compliance': { showComponent: false, showEnvironment: false },
  '/cost-management': { showComponent: false, showEnvironment: true },
  '/team-management': { showComponent: false, showEnvironment: false },
  '/incidents': { showComponent: true, showEnvironment: true },
  '/settings': { showComponent: false, showEnvironment: false },
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const config = routeConfig[location.pathname] || { showComponent: true, showEnvironment: true }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <TopNav 
        showComponentSelector={config.showComponent}
        showEnvironmentSelector={config.showEnvironment}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}