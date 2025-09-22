/**
 * Example of a third-party module for OpenChoreo
 * This shows how external developers would create modules
 */

// Third-party modules access shared dependencies via window.OpenChoreo
const { React, UI, Icons, Utils, ReactQuery, Store } = window.OpenChoreo
const { Button, Card, CardContent, CardHeader, CardTitle, Badge } = UI
const { Activity, Users, TrendingUp } = Icons
const { cn } = Utils
const { useQuery } = ReactQuery
const { useGlobalStore } = Store

// Module component
function MyCustomDashboard() {
  const { currentProject } = useGlobalStore()
  
  const { data, isLoading } = useQuery({
    queryKey: ['my-custom-data', currentProject?.id],
    queryFn: async () => {
      // Fetch data from your API
      const response = await fetch(`/api/custom/${currentProject?.id}`)
      return response.json()
    },
    enabled: !!currentProject,
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Custom Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Powered by third-party module using OpenChoreo components
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.users || '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.apiCalls || '---'}
            </div>
            <Badge variant="secondary">Per minute</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              Run Analysis
            </Button>
            <Button className="w-full" variant="outline">
              Export Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Register the module with OpenChoreo
window.OpenChoreo.registerModule({
  id: 'custom-analytics',
  name: 'Custom Analytics',
  version: '1.0.0',
  type: 'dashboard',
  routes: [
    {
      path: '/custom-analytics',
      component: MyCustomDashboard,
      label: 'Custom Analytics',
      icon: 'BarChart',
      perspective: 'development', // Can be 'development', 'platform-engineering', or 'both'
    }
  ],
  dashboard: {
    cards: [
      {
        id: 'custom-metrics',
        component: () => (
          <Card>
            <CardHeader>
              <CardTitle>Quick Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-sm text-muted-foreground">
                Custom metric from third-party module
              </p>
            </CardContent>
          </Card>
        ),
        position: 'top',
        size: 'small',
      }
    ]
  },
  init: async (context) => {
    console.log('Custom Analytics module initialized')
    // Can access context.globalState, context.api, etc.
  }
})