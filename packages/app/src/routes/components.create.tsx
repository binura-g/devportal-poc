import { createFileRoute } from '@tanstack/react-router'
import { CreateComponent } from '@/modules/dev-components'

export const Route = createFileRoute('/components/create')({
  component: CreateComponent,
})