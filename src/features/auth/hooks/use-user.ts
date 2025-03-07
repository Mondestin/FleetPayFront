import { authService } from '../data/auth-service'
import { type User } from '../data/schema'

export function useUser() {
  const user = authService.getUser()
  return { user }
} 