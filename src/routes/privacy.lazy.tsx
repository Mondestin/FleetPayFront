import { createLazyFileRoute } from '@tanstack/react-router'
import { Privacy } from '@/features/home/components/privacy'

export const Route = createLazyFileRoute('/privacy')({
  component: Privacy,
}) 