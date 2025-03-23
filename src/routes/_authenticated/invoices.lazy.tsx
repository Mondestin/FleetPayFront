import { createLazyFileRoute } from '@tanstack/react-router'
import { Invoices } from '@/features/invoices'

export const Route = createLazyFileRoute('/_authenticated/invoices')({
  component: Invoices
}) 