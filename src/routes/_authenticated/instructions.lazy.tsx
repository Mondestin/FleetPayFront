import { createLazyFileRoute } from '@tanstack/react-router'
import { Instructions } from '@/features/instructions'

export const Route = createLazyFileRoute('/_authenticated/instructions')({
  component: Instructions,
}) 