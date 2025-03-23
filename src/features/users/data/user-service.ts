import { type User, type PaginatedUsers } from '../types'
import { api } from '@/lib/api'

export const userService = {
  getAll: async (search?: string): Promise<PaginatedUsers> => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    const response = await api.get<PaginatedUsers>(`/api/users?${params.toString()}`)
    return response.data
  },

  create: async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {

    const response = await api.post<User>('/api/users', user)
    return response.data
  },

  update: async (id: number, user: Partial<User>) => {
    const response = await api.put<User>(`/api/users/${id}`, user)
    return response.data
  },

  delete: async (id: number) => {
    await api.delete(`/api/users/${id}`)
  }
}