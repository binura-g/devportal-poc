import { MetricsCards } from '../components/MetricsCards'
import { EnabledModules } from '../components/EnabledModules'
import { QuickActions } from '../components/QuickActions'

export function PEDashboard() {
  console.log('PEDashboard component rendering')
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Engineering Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor and manage your platform infrastructure</p>
      </div>

      <MetricsCards />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <EnabledModules />
        <QuickActions />
      </div>
    </div>
  )
}