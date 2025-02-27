import { z } from 'zod'

// Define the driver schema
export const driverSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  status: z.enum(['active', 'inactive']),
  created_at: z.string(),
  updated_at: z.string(),
})

// Define the pagination metadata schema
export const paginationSchema = z.object({
  current_page: z.number(),
  first_page_url: z.string().nullable(),
  from: z.number(),
  last_page: z.number(),
  last_page_url: z.string().nullable(),
  next_page_url: z.string().nullable(),
  path: z.string(),
  per_page: z.number(),
  prev_page_url: z.string().nullable(),
  to: z.number(),
  total: z.number(),
})

// Define the links schema
export const linkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean(),
})

// Define the complete paginated response schema
export const paginatedDriversSchema = z.object({
  data: z.array(driverSchema),
  ...paginationSchema.shape,
  links: z.array(linkSchema),
})

export type Driver = z.infer<typeof driverSchema>
export type PaginatedDrivers = z.infer<typeof paginatedDriversSchema> 