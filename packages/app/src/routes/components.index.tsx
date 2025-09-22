import { createFileRoute } from '@tanstack/react-router'
import { ComponentList } from '@/modules/dev-components'

export const Route = createFileRoute('/components/')({
  component: ComponentList,
})