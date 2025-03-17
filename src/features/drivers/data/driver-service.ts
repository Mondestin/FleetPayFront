import { type Driver, type PaginatedDrivers } from './schema'
import { api } from '@/lib/api'

export const driverService = {
  getAll: async (search?: string): Promise<PaginatedDrivers> => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    
    const response = await api.get<PaginatedDrivers>(`/api/drivers?${params.toString()}`)
    return response.data
  },

  create: async (driver: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<Driver>('/api/drivers', driver)
    return response.data
  },

  update: async (id: string, driver: Partial<Driver>) => {
    const response = await api.put<Driver>(`/api/drivers/${id}`, driver)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/api/drivers/${id}`)
  }
} 