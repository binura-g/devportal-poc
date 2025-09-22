// Module exports
export { LogsPage } from './pages/LogsPage'
export { LogFilters } from './components/LogFilters'
export { LogEntry } from './components/LogEntry'

// Hooks and queries
export { useLogsQuery, useLogStream } from './services/api/queries'

// Types
export type { 
  LogEntry as LogEntryType,
  LogLevel,
  LogSource,
  LogFilter,
  LogsPageParams,
  LogsResponse
} from './types/log.types'

// Utils
export { generateMockLogs, getAvailableComponents } from './utils/mockLogs'

// Module configuration
export { config as moduleConfig } from './module.config'