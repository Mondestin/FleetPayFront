import { api } from '@/lib/api'
import { type Invoice, type PaginatedInvoices } from './schema'

export const invoiceService = {
  getAll: async (search?: string): Promise<PaginatedInvoices> => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    
    const response = await api.get<PaginatedInvoices>(`/api/invoices?${params.toString()}`)
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<Invoice>(`/api/invoices/${id}`)
    return response.data
  },

  create: async (data: Partial<Invoice>) => {
    const response = await api.post<Invoice>('/api/invoices', data)
    return response.data
  },

  update: async (id: string, data: Partial<Invoice>) => {
    const response = await api.put<Invoice>(`/api/invoices/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete<Invoice>(`/api/invoices/${id}`)
  },
} 