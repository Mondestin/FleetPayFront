import { createLazyFileRoute } from '@tanstack/react-router'
import Drivers from '@/features/drivers'

export const Route = createLazyFileRoute('/_authenticated/drivers')({
  component: Drivers,
}) 