import { z } from 'zod'

// User schema
export const userSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string().email(),
  phone_number: z.string().nullable(),
  role: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  email_verified_at: z.string().nullable(),
  remember_token: z.string().nullable()
})

// Driver schema
export const driverSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  email: z.string().email(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})

// Payment Report schema
export const paymentReportSchema = z.object({
  id: z.string(),
  driver_id: z.string(),
  week_start_date: z.string(),
  bolt_earnings: z.string(),
  uber_earnings: z.string(),
  heetch_earnings: z.string(),
  commission_amount: z.string(),
  total_due: z.string(),
  status: z.enum(['paid', 'pending']),
  created_by: userSchema,
  created_at: z.string(),
  updated_at: z.string(),
  total_earnings: z.number(),
  driver: driverSchema,
})

// Pagination schema
export const paginationSchema = z.object({
  current_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  last_page: z.number(),
  links: z.array(z.any())
})

export const linkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const paginatedPaymentReportsSchema = z.object({
  data: z.array(paymentReportSchema),
  ...paginationSchema.shape
})

export type PaymentReport = z.infer<typeof paymentReportSchema>
export type PaginatedPaymentReports = z.infer<typeof paginatedPaymentReportsSchema> 