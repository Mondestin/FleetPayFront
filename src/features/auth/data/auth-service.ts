import { api } from '@/lib/api'
import { type LoginResponse, type LoginCredentials, type User } from './schema'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/api/login', credentials)
    this.setUser(response.data.user)
    return response.data
  },

  setToken(token: string) {
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },

  getToken() {
    return localStorage.getItem('token')
  },

  removeToken() {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  },

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
  },

  getUser(): User | null {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  removeUser() {
    localStorage.removeItem('user')
  },

  isAuthenticated() {
    return !!this.getToken()
  }
} 