import { type PaymentReport, type PaginatedPaymentReports } from './schema'
import { api } from '@/lib/api'

export const paymentReportService = {
  getAll: async (page: number = 1, weekStart: string, search?: string): Promise<PaginatedPaymentReports> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('week_start', weekStart)
    if (search) params.append('search', search)
    
    const response = await api.get<PaginatedPaymentReports>(`/api/platform-earnings?${params.toString()}`)
    return response.data
  },

  create: async (report: Omit<PaymentReport, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'driver'>) => {
    const response = await api.post<PaymentReport>('/api/platform-earnings', report)
    return response.data
  },

  update: async (id: string, report: Partial<PaymentReport>) => {
    const response = await api.put<PaymentReport>(`/api/platform-earnings/${id}`, {
      id,
      ...report
    })
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/api/payment-reports/${id}`)
  }
} 