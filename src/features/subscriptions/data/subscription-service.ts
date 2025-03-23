import { type Subscription, type PaginatedSubscriptions } from './schema'
import { api } from '@/lib/api'


export const subscriptionService = {
  getAll: async (page: number = 1, search?: string): Promise<PaginatedSubscriptions> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    if (search) params.append('search', search)
    
    const response = await api.get<PaginatedSubscriptions>(`/api/subscriptions?${params.toString()}`)
    return response.data
  },

  getById: async (id: string): Promise<Subscription> => {
    const response = await api.get<Subscription>(`/api/subscriptions/${id}`)
    return response.data
  },

  create: async (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'user'>) => {
    const response = await api.post<Subscription>('/api/subscriptions', data)
    return response.data
  },

  update: async (id: string, subscription: Partial<Subscription>) => {
    const response = await api.put<Subscription>(`/api/subscriptions/${id}`, subscription)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/api/subscriptions/${id}`)
  },

  getSubscriptionWithInvoices: async (id: string) => {
    const response = await api.get<Subscription>(`/api/subscriptions/${id}/invoices`)
    return response.data
  }
} 