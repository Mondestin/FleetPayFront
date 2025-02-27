import { createLazyFileRoute } from '@tanstack/react-router'
import FilesManager from '@/features/reports'  // We'll move the folder too

export const Route = createLazyFileRoute('/_authenticated/reports')({
  component: FilesManager,
}) 