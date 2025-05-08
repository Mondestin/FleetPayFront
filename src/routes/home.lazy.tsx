import { createLazyFileRoute } from '@tanstack/react-router'
import { Home } from '@/features/home'

export const Route = createLazyFileRoute('/home')({
  component: Home,
}) 