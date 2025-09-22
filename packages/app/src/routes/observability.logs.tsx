import { createFileRoute } from '@tanstack/react-router'
import { LogsPage } from '@/modules/observability'

export const Route = createFileRoute('/observability/logs')({
  component: LogsPage,
})