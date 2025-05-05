import { createLazyFileRoute } from '@tanstack/react-router'
import SubscriptionDetailsPage from '@/features/subscription-details'

export const Route = createLazyFileRoute('/_authenticated/subscription-details')({
  component: SubscriptionDetailsPage,
})