import { z } from 'zod'

export const invoiceSchema = z.object({
  id: z.string(),
  invoice_number: z.string(),
  subscription_id: z.string(),
  amount: z.number(),
  status: z.enum(['pending', 'paid', 'overdue']),
  issue_date: z.string(),
  due_date: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  subscription: z.object({
    id: z.string(),
    user_id: z.string(),
    amount: z.number(),
    status: z.string(),
    user: z.object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      email: z.string(),
    }),
  }),
})

export const paginatedInvoicesSchema = z.object({
  data: z.array(invoiceSchema),
  meta: z.object({
    current_page: z.number(),
    from: z.number(),
    last_page: z.number(),
    per_page: z.number(),
    to: z.number(),
    total: z.number(),
  }),
})

export type Invoice = z.infer<typeof invoiceSchema>
export type PaginatedInvoices = z.infer<typeof paginatedInvoicesSchema> 