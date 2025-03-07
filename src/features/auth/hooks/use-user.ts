import { authService } from '../data/auth-service'

export function useUser() {
  const user = authService.getUser()
  return { user }
} 