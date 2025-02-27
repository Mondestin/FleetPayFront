import { date, z } from 'zod'
import { userSchema, paginationSchema, linkSchema } from '@/features/payment-reports/data/schema'

export const invoiceSchema = z.object({
  id: z.string(),
  invoice_number: z.string(),
  user_id: z.string(),
  amount: z.string(),
  status: z.enum(['paid', 'pending', 'overdue']),
  issue_date: date(),
  due_date: date(),
  created_by: userSchema,
  created_at: date(),
  updated_at: date(),
  user: userSchema,
})

export const paginatedInvoicesSchema = z.object({
  data: z.array(invoiceSchema),
  ...paginationSchema.shape,
  links: z.array(linkSchema),
})

export type Invoice = z.infer<typeof invoiceSchema>
export type PaginatedInvoices = z.infer<typeof paginatedInvoicesSchema> 