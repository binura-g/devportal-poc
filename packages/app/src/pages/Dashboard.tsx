import { useGlobalStore } from '@/stores/global.store'
import { PEDashboard } from '@/modules/pe-dashboard/pages/PEDashboard'
import { DevDashboard } from '@/modules/dev-dashboard/pages/DevDashboard'

export function Dashboard() {
  const { perspective } = useGlobalStore()

  console.log('Dashboard - Current perspective:', perspective)

  // Show appropriate dashboard based on perspective
  if (perspective === 'platform-engineering') {
    console.log('Rendering PE Dashboard')
    return <PEDashboard />
  }

  // Development perspective
  console.log('Rendering Dev Dashboard')
  return <DevDashboard />
}