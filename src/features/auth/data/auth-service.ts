import { api } from '@/lib/api'
import { type LoginResponse, type LoginCredentials, type User } from './schema'

interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/api/login', credentials)
    this.setUser(response.data.user)
    return response.data
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/api/register', data)
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