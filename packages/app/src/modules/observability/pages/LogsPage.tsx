import { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { LogFilters } from '../components/LogFilters'
import { LogEntry } from '../components/LogEntry'
import { useLogsQuery, useLogStream } from '../services/api/queries'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { LogFilter } from '../types/log.types'
import { useGlobalStore } from '@/stores/global.store'

export function LogsPage() {
  const [filters, setFilters] = useState<LogFilter>({})
  const [streamEnabled, setStreamEnabled] = useState(false)
  const [newLogIds, setNewLogIds] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver>()
  const lastLogRef = useRef<HTMLDivElement>(null)
  
  const { currentProject, currentEnvironment } = useGlobalStore()

  // Apply global filters
  const appliedFilters: LogFilter = {
    ...filters,
    projectId: currentProject?.id,
    environmentId: currentEnvironment?.id,
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useLogsQuery(appliedFilters)

  // Use streaming hook with new log count
  const { newLogCount } = useLogStream(appliedFilters, streamEnabled)

  // Track new logs for animation
  useEffect(() => {
    if (!data?.pages?.[0]?.logs) return
    
    const currentIds = new Set(
      data.pages.flatMap(page => page.logs.map(log => log.id))
    )
    
    const newIds = new Set<string>()
    currentIds.forEach(id => {
      if (!newLogIds.has(id)) {
        newIds.add(id)
      }
    })
    
    if (newIds.size > 0) {
      setNewLogIds(newIds)
      // Clear new status after animation
      setTimeout(() => {
        setNewLogIds(new Set())
      }, 1000)
    }
  }, [data])

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    }
    observerRef.current = new IntersectionObserver(handleObserver, option)
    
    if (lastLogRef.current) {
      observerRef.current.observe(lastLogRef.current)
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  const allLogs = data?.pages?.flatMap(page => page.logs) || []
  const totalLogs = data?.pages?.[0]?.total

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden p-4">
      <div className="flex flex-col h-[calc(100%-1rem)] bg-background rounded-lg border shadow-sm overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b px-6 py-4">
          <h1 className="text-2xl font-bold">Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time logs from all your components and services
          </p>
        </div>

        {/* Fixed Filters */}
        <div className="flex-shrink-0 px-6 py-4 border-b">
          <LogFilters
            filters={filters}
            onFiltersChange={setFilters}
            onStreamToggle={setStreamEnabled}
            streamEnabled={streamEnabled}
            totalLogs={totalLogs}
          />
        </div>

        {/* Scrollable Log Container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto px-6 py-4 pb-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error?.message || 'Failed to load logs'}
              </AlertDescription>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                Retry
              </Button>
            </Alert>
          )}

          {!isLoading && !isError && allLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No logs found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}

          {allLogs.length > 0 && (
            <div className="space-y-1">
              {/* New logs loading indicator */}
              {streamEnabled && newLogCount > 0 && (
                <div className="flex items-center justify-center py-2 bg-blue-50 dark:bg-blue-950 rounded animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    {newLogCount} new {newLogCount === 1 ? 'log' : 'logs'} incoming...
                  </span>
                </div>
              )}
              
              {allLogs.map((log, index) => (
                <div
                  key={log.id}
                  ref={index === allLogs.length - 5 ? lastLogRef : null}
                >
                  <LogEntry 
                    log={log} 
                    isNew={newLogIds.has(log.id)}
                  />
                </div>
              ))}
              
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading more logs...
                  </span>
                </div>
              )}
              
              {!hasNextPage && allLogs.length > 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No more logs to load
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}