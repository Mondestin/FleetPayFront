import { createLazyFileRoute } from '@tanstack/react-router'
import { SignUp } from '@/features/auth/sign-up'

export const Route = createLazyFileRoute('/sign-up')({
  component: SignUp,
}) 