import { useState } from 'react'
import { Search, Filter, Clock, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { LogLevel, LogSource, LogFilter } from '../types/log.types'
import { getAvailableComponents } from '../utils/mockLogs'
import { useGlobalStore } from '@/stores/global.store'

interface LogFiltersProps {
  filters: LogFilter
  onFiltersChange: (filters: LogFilter) => void
  onStreamToggle: (enabled: boolean) => void
  streamEnabled: boolean
  totalLogs?: number
}

const LOG_LEVELS: { value: LogLevel; label: string; color: string }[] = [
  { value: 'debug', label: 'Debug', color: 'bg-gray-500' },
  { value: 'info', label: 'Info', color: 'bg-blue-500' },
  { value: 'warn', label: 'Warning', color: 'bg-yellow-500' },
  { value: 'error', label: 'Error', color: 'bg-red-500' },
  { value: 'fatal', label: 'Fatal', color: 'bg-purple-500' },
]

const LOG_SOURCES: { value: LogSource; label: string }[] = [
  { value: 'application', label: 'Application' },
  { value: 'system', label: 'System' },
  { value: 'database', label: 'Database' },
  { value: 'network', label: 'Network' },
  { value: 'security', label: 'Security' },
]

const TIME_RANGES = [
  { value: '15m', label: 'Last 15 minutes' },
  { value: '1h', label: 'Last hour' },
  { value: '3h', label: 'Last 3 hours' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '12h', label: 'Last 12 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
]

export function LogFilters({
  filters,
  onFiltersChange,
  onStreamToggle,
  streamEnabled,
  totalLogs
}: LogFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')
  const components = getAvailableComponents()
  const { currentProject, currentEnvironment } = useGlobalStore()

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    // Debounce search
    const timeout = setTimeout(() => {
      onFiltersChange({ ...filters, search: value })
    }, 300)
    return () => clearTimeout(timeout)
  }

  const handleLevelToggle = (level: LogLevel) => {
    const currentLevels = filters.level || []
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level]
    onFiltersChange({ ...filters, level: newLevels.length > 0 ? newLevels : undefined })
  }

  const handleSourceToggle = (source: LogSource) => {
    const currentSources = filters.source || []
    const newSources = currentSources.includes(source)
      ? currentSources.filter(s => s !== source)
      : [...currentSources, source]
    onFiltersChange({ ...filters, source: newSources.length > 0 ? newSources : undefined })
  }

  const handleComponentChange = (componentId: string) => {
    onFiltersChange({ 
      ...filters, 
      componentId: componentId === 'all' ? undefined : componentId 
    })
  }

  const activeFilterCount = [
    filters.level?.length,
    filters.source?.length,
    filters.componentId,
    filters.search
  ].filter(Boolean).length

  return (
    <div className="space-y-4 border-b pb-4">
      {/* Component Selector and Search */}
      <div className="flex items-center gap-4">
        <Select
          value={filters.componentId || 'all'}
          onValueChange={handleComponentChange}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select component" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Components</SelectItem>
            {components.map(component => (
              <SelectItem key={component.id} value={component.id}>
                {component.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-40">
            <Clock className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Log Level Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Log Level
                {filters.level?.length && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.level.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Log Levels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LOG_LEVELS.map(level => (
                <DropdownMenuCheckboxItem
                  key={level.value}
                  checked={filters.level?.includes(level.value) || false}
                  onCheckedChange={() => handleLevelToggle(level.value)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${level.color}`} />
                    {level.label}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Source Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Source
                {filters.source?.length && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.source.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Log Sources</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LOG_SOURCES.map(source => (
                <DropdownMenuCheckboxItem
                  key={source.value}
                  checked={filters.source?.includes(source.value) || false}
                  onCheckedChange={() => handleSourceToggle(source.value)}
                >
                  {source.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({})}
            >
              Clear filters ({activeFilterCount})
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {totalLogs !== undefined && (
            <span className="text-sm text-muted-foreground">
              {totalLogs.toLocaleString()} logs
            </span>
          )}
          
          <Button
            variant={streamEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onStreamToggle(!streamEnabled)}
          >
            {streamEnabled ? (
              <>
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </>
            ) : (
              <>
                <div className="mr-2 h-2 w-2 rounded-full bg-gray-400" />
                Paused
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(currentProject || currentEnvironment) && (
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Filtering by:</span>
          {currentProject && (
            <Badge variant="secondary">{currentProject.name}</Badge>
          )}
          {currentEnvironment && (
            <Badge variant="secondary">{currentEnvironment.name}</Badge>
          )}
        </div>
      )}
    </div>
  )
}