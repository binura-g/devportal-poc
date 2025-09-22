import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { LogsPageParams, LogsResponse, LogFilter } from '../../types/log.types'
import { generateMockLogs } from '../../utils/mockLogs'

// Mock API function
const fetchLogs = async ({ 
  cursor, 
  limit = 50, 
  filters 
}: LogsPageParams): Promise<LogsResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const logs = generateMockLogs(limit, cursor, filters)
  const hasMore = Math.random() > 0.2 // 80% chance of having more logs
  
  return {
    logs,
    nextCursor: hasMore ? `cursor-${Date.now()}` : undefined,
    hasMore,
    total: Math.floor(Math.random() * 10000) + 1000
  }
}

// Infinite query hook
export function useLogsQuery(filters?: LogFilter) {
  return useInfiniteQuery({
    queryKey: ['logs', filters],
    queryFn: ({ pageParam }) => fetchLogs({
      cursor: pageParam,
      filters,
      limit: 50
    }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    refetchInterval: false,
    staleTime: 30000, // 30 seconds
  })
}

// Hook for simulating streaming logs - returns newLogCount
export function useLogStream(filters?: LogFilter, enabled: boolean = false) {
  const queryClient = useQueryClient()
  const [newLogCount, setNewLogCount] = useState(0)
  
  useEffect(() => {
    if (!enabled) {
      setNewLogCount(0)
      return
    }
    
    const interval = setInterval(() => {
      // Show loading indicator
      setNewLogCount(prev => prev + 1)
      
      // Add new logs to the cache after a longer delay
      setTimeout(() => {
        queryClient.setQueryData(['logs', filters], (oldData: any) => {
          if (!oldData?.pages?.length) return oldData
          
          const newLog = generateMockLogs(1, undefined, filters)[0]
          
          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                logs: [newLog, ...oldData.pages[0].logs].slice(0, 50)
              },
              ...oldData.pages.slice(1)
            ]
          }
        })
        setNewLogCount(prev => Math.max(0, prev - 1))
      }, 1500) // Longer delay to show loading state more clearly
    }, Math.random() * 3000 + 2000) // Random interval between 2-5 seconds
    
    return () => {
      clearInterval(interval)
      setNewLogCount(0)
    }
  }, [enabled, filters, queryClient])
  
  return { newLogCount }
}