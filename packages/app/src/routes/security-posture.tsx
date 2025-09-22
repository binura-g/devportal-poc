import { createFileRoute } from '@tanstack/react-router'

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-muted-foreground mt-2">This page is under construction</p>
  </div>
)

export const Route = createFileRoute('/security-posture')({
  component: () => <PlaceholderPage title="Security Posture" />,
})