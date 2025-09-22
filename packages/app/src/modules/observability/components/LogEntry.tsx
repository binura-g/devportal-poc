import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LogEntry as LogEntryType } from '../types/log.types'

interface LogEntryProps {
  log: LogEntryType
  isNew?: boolean
}

const levelColors = {
  debug: 'bg-gray-100 text-gray-700 border-gray-300',
  info: 'bg-blue-100 text-blue-700 border-blue-300',
  warn: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  error: 'bg-red-100 text-red-700 border-red-300',
  fatal: 'bg-purple-100 text-purple-700 border-purple-300',
}

const levelBorderColors = {
  debug: 'border-l-gray-500',
  info: 'border-l-blue-500',
  warn: 'border-l-yellow-500',
  error: 'border-l-red-500',
  fatal: 'border-l-purple-500',
}

export function LogEntry({ log, isNew }: LogEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const logText = JSON.stringify(log, null, 2)
    navigator.clipboard.writeText(logText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTimestamp = (date: Date) => {
    const time = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
    const ms = date.getMilliseconds().toString().padStart(3, '0')
    return `${time}.${ms}`
  }

  return (
    <div
      className={cn(
        'group relative border-l-2 bg-card rounded p-2 transition-all hover:shadow-sm',
        levelBorderColors[log.level],
        isNew && 'animate-in slide-in-from-top duration-300 bg-accent/5'
      )}
    >
      {/* Compact single-line header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>

        <span className="font-mono text-xs text-muted-foreground">
          {formatTimestamp(new Date(log.timestamp))}
        </span>
        
        <Badge variant="outline" className={cn('text-xs px-1.5 py-0', levelColors[log.level])}>
          {log.level.toUpperCase()}
        </Badge>

        <span className="text-xs font-medium text-muted-foreground">
          {log.componentName}
        </span>

        <span className="text-sm flex-1 truncate">
          {log.message}
        </span>

        {log.traceId && (
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            trace
          </Badge>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="ml-6 mt-2 space-y-1 text-xs border-t pt-2">
          <div className="flex gap-4 text-muted-foreground">
            <span><strong>Project:</strong> {log.projectName}</span>
            <span><strong>Service:</strong> {log.service}</span>
            <span><strong>Host:</strong> {log.hostname}</span>
            {log.traceId && (
              <span>
                <strong>Trace:</strong> <code className="bg-muted px-1 rounded">{log.traceId.slice(0, 8)}...</code>
              </span>
            )}
          </div>
          
          {log.details && (
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto max-h-32">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          )}
        </div>
      )}

      {copied && (
        <div className="absolute right-8 top-2 text-xs text-muted-foreground animate-in fade-in bg-background px-1 rounded">
          Copied!
        </div>
      )}
    </div>
  )
}