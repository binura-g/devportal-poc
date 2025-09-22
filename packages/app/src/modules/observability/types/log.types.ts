export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export type LogSource = 'application' | 'system' | 'database' | 'network' | 'security'

export interface LogEntry {
  id: string
  timestamp: Date
  level: LogLevel
  source: LogSource
  componentId: string
  componentName: string
  projectId: string
  projectName: string
  environmentId: string
  environmentName: string
  message: string
  details?: Record<string, any>
  traceId?: string
  spanId?: string
  userId?: string
  requestId?: string
  hostname?: string
  service?: string
  tags?: string[]
}

export interface LogFilter {
  projectId?: string
  environmentId?: string
  componentId?: string
  level?: LogLevel[]
  source?: LogSource[]
  timeRange?: {
    start: Date
    end: Date
  }
  search?: string
}

export interface LogsPageParams {
  cursor?: string
  limit?: number
  filters?: LogFilter
}

export interface LogsResponse {
  logs: LogEntry[]
  nextCursor?: string
  hasMore: boolean
  total: number
}