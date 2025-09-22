import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

function ObservabilityLayout() {
  const navigate = useNavigate()
  
  // Redirect to logs by default
  useEffect(() => {
    if (window.location.pathname === '/observability') {
      navigate({ to: '/observability/logs' })
    }
  }, [navigate])

  return <Outlet />
}

export const Route = createFileRoute('/observability')({
  component: ObservabilityLayout,
})