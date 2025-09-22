import type { LogEntry, LogLevel, LogSource, LogFilter } from '../types/log.types'

const LOG_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal']
const LOG_SOURCES: LogSource[] = ['application', 'system', 'database', 'network', 'security']

const LOG_MESSAGES = {
  debug: [
    'Entering function processRequest()',
    'Cache hit for key: user_preferences',
    'Database connection pool size: 10',
    'Request headers: {"Content-Type": "application/json"}',
    'Parsing configuration file: config.yml'
  ],
  info: [
    'Server started on port 3000',
    'Successfully connected to database',
    'User authentication successful',
    'Request completed successfully',
    'Background job initiated',
    'Cache refreshed successfully',
    'API endpoint called: /api/v1/components'
  ],
  warn: [
    'Deprecated API endpoint used',
    'High memory usage detected: 85%',
    'Slow query detected: 2.5s',
    'Rate limit approaching: 450/500 requests',
    'Configuration value missing, using default',
    'Connection pool nearing capacity'
  ],
  error: [
    'Failed to connect to external service',
    'Database query failed: timeout',
    'Invalid authentication token',
    'File not found: config.json',
    'Permission denied: write access to /logs',
    'API request failed: 500 Internal Server Error'
  ],
  fatal: [
    'Out of memory exception',
    'Database connection lost',
    'Critical service unavailable',
    'System shutdown initiated',
    'Unrecoverable error in main process'
  ]
}

const COMPONENTS = [
  { id: 'comp-1', name: 'API Gateway' },
  { id: 'comp-2', name: 'Auth Service' },
  { id: 'comp-3', name: 'User Service' },
  { id: 'comp-4', name: 'Payment Service' },
  { id: 'comp-5', name: 'Notification Service' },
  { id: 'comp-6', name: 'Analytics Engine' },
  { id: 'comp-7', name: 'Cache Layer' },
  { id: 'comp-8', name: 'Message Queue' }
]

const PROJECTS = [
  { id: 'proj-1', name: 'E-Commerce Platform' },
  { id: 'proj-2', name: 'Mobile Banking App' },
  { id: 'proj-3', name: 'Data Analytics Dashboard' }
]

const ENVIRONMENTS = [
  { id: 'env-1', name: 'Development' },
  { id: 'env-2', name: 'Staging' },
  { id: 'env-3', name: 'Production' }
]

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateLogEntry(filters?: LogFilter): LogEntry {
  const level = filters?.level?.length 
    ? randomElement(filters.level) 
    : randomElement(LOG_LEVELS)
  
  const source = filters?.source?.length
    ? randomElement(filters.source)
    : randomElement(LOG_SOURCES)
    
  const component = filters?.componentId
    ? COMPONENTS.find(c => c.id === filters.componentId) || randomElement(COMPONENTS)
    : randomElement(COMPONENTS)
    
  const project = filters?.projectId
    ? PROJECTS.find(p => p.id === filters.projectId) || randomElement(PROJECTS)
    : randomElement(PROJECTS)
    
  const environment = filters?.environmentId
    ? ENVIRONMENTS.find(e => e.id === filters.environmentId) || randomElement(ENVIRONMENTS)
    : randomElement(ENVIRONMENTS)
  
  const timestamp = new Date()
  timestamp.setSeconds(timestamp.getSeconds() - Math.floor(Math.random() * 3600))
  
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp,
    level,
    source,
    componentId: component.id,
    componentName: component.name,
    projectId: project.id,
    projectName: project.name,
    environmentId: environment.id,
    environmentName: environment.name,
    message: randomElement(LOG_MESSAGES[level]),
    details: Math.random() > 0.5 ? {
      duration: Math.floor(Math.random() * 5000),
      userId: `user-${Math.floor(Math.random() * 1000)}`,
      requestMethod: randomElement(['GET', 'POST', 'PUT', 'DELETE']),
      statusCode: randomElement([200, 201, 400, 401, 404, 500]),
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    } : undefined,
    traceId: Math.random() > 0.3 ? `trace-${Math.random().toString(36).substr(2, 16)}` : undefined,
    spanId: Math.random() > 0.5 ? `span-${Math.random().toString(36).substr(2, 8)}` : undefined,
    hostname: `server-${Math.floor(Math.random() * 10) + 1}.openchoreo.local`,
    service: component.name.toLowerCase().replace(/\s+/g, '-'),
    tags: Math.random() > 0.6 ? [
      randomElement(['critical', 'monitoring', 'performance', 'security', 'audit']),
      randomElement(['automated', 'manual', 'scheduled', 'triggered'])
    ] : undefined
  }
}

export function generateMockLogs(
  count: number, 
  _cursor?: string,
  filters?: LogFilter
): LogEntry[] {
  const logs: LogEntry[] = []
  
  for (let i = 0; i < count; i++) {
    const log = generateLogEntry(filters)
    
    // Apply search filter if provided
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase()
      const matchesSearch = 
        log.message.toLowerCase().includes(searchTerm) ||
        log.componentName.toLowerCase().includes(searchTerm) ||
        log.level.includes(searchTerm) ||
        log.source.includes(searchTerm)
      
      if (matchesSearch) {
        logs.push(log)
      }
    } else {
      logs.push(log)
    }
  }
  
  // Sort by timestamp (newest first)
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getAvailableComponents() {
  return COMPONENTS
}

export function getAvailableProjects() {
  return PROJECTS
}

export function getAvailableEnvironments() {
  return ENVIRONMENTS
}