import { date, z } from 'zod'
import { userSchema, paginationSchema } from '@/features/payment-reports/data/schema'

export const invoiceSchema = z.object({
  id: z.string(),
  invoice_number: z.string(),
  subscription_id: z.string(),
  amount: z.string(),
  status: z.enum(['paid', 'pending', 'failed']),
  issue_date: z.string(),
  due_date: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})

export const subscriptionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  start_date: date(),
  end_date: date(),
  amount: z.string(),
  status: z.enum(['active', 'expired', 'canceled']),
  payment_status: z.enum(['paid', 'pending', 'failed']),
  created_at: z.string(),
  updated_at: z.string(),
  plan_name: z.enum(['Free', 'Pro']),
  expires_at: z.string(),
  payment_method: z.string(),
  invoices: z.array(invoiceSchema).optional(),
  user: userSchema
})

export const paginatedSubscriptionsSchema = z.object({
  data: z.array(subscriptionSchema),
  ...paginationSchema.shape
})

export const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  features: z.array(z.string()),
  billingPeriod: z.enum(['monthly', 'yearly']),
})

export type Subscription = z.infer<typeof subscriptionSchema>
export type PaginatedSubscriptions = z.infer<typeof paginatedSubscriptionsSchema>
export type Plan = z.infer<typeof planSchema> 