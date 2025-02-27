import { createLazyFileRoute } from '@tanstack/react-router'
import Subscriptions from '@/features/subscriptions'

export const Route = createLazyFileRoute('/_authenticated/subscriptions')({
  component: Subscriptions,
}) 