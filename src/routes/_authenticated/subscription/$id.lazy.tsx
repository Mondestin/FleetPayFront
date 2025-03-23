import { createLazyFileRoute } from '@tanstack/react-router'
import Subscription from '@/features/subscriptions/details'

export const Route = createLazyFileRoute('/_authenticated/subscription/$id')({
  component: Subscription,
})
