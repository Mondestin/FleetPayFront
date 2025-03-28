import { createLazyFileRoute } from '@tanstack/react-router'
import Support from '@/features/support'

export const Route = createLazyFileRoute('/_authenticated/support')({
  component: Support,
}) 