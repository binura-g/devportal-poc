import { useGlobalStore } from '@/stores/global.store'
import { PEDashboard } from '@/modules/pe-dashboard'
import { DevDashboard } from '@/modules/dev-dashboard'

export function Dashboard() {
  const { perspective } = useGlobalStore()
  
  return perspective === 'platform-engineering' ? <PEDashboard /> : <DevDashboard />
}

export const moduleConfig = {
  id: 'dashboard',
  name: 'Dashboard',
  description: 'Main dashboard that switches between PE and Dev perspectives',
  version: '1.0.0',
  perspectives: ['development', 'platform-engineering'],
}