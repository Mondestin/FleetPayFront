import { createLazyFileRoute } from '@tanstack/react-router'
import PaymentReports from '@/features/payment-reports'

export const Route = createLazyFileRoute('/_authenticated/payment-reports')({
  component: PaymentReports,
}) 