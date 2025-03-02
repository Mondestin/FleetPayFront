import { z } from 'zod'

const userSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string(),
  email_verified_at: z.string().nullable(),
  phone_number: z.string().nullable(),
  role: z.string(),
  status: z.string(),
  remember_token: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string()
})

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema
})

export type LoginResponse = z.infer<typeof loginResponseSchema>
export type User = z.infer<typeof userSchema>

export interface LoginCredentials {
  email: string
  password: string
  device_name: string
} 