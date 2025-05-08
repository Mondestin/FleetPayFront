import { createLazyFileRoute } from '@tanstack/react-router'
import { Terms } from '@/features/home/components/terms'

export const Route = createLazyFileRoute('/terms')({
  component: Terms,
}) 