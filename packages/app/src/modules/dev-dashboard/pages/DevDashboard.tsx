import { RecentComponents } from '../components/RecentComponents'
import { QuickActions } from '../components/QuickActions'
import { useGlobalStore } from '@/stores/global.store'

export function DevDashboard() {
  const { currentProject } = useGlobalStore()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Development Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {currentProject 
            ? `Working on ${currentProject.name}` 
            : 'Select a project to get started'}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Components - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentComponents />
        </div>
        
        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}