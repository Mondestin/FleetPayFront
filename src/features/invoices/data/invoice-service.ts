import { type Invoice, type PaginatedInvoices } from './schema'
import { api } from '@/lib/api'


export const invoiceService = {
  getAll: async (page: number = 1, search?: string): Promise<PaginatedInvoices> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    if (search) params.append('search', search)
    
    const response = await api.get<PaginatedInvoices>(`/api/invoices?${params.toString()}`)
    return response.data
  },

  create: async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'user'>) => {
    const response = await api.post<Invoice>('/api/invoices', invoice)
    return response.data
  },

  update: async (id: string, invoice: Partial<Invoice>) => {
    const response = await api.put<Invoice>(`/api/invoices/${id}`, invoice)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/api/invoices/${id}`)
  }
} 