import { api } from '@/lib/api'
import { format } from 'date-fns'

export type Platform = 'uber' | 'bolt' | 'heetch'

export interface ImportStatus {
  platform: Platform
  status: string
  last_import: string
  next_import: string
  total_records: number
  processed_records: number
  failed_records: number
  uploaded: any
  validated: any
}

export const importStatusService = {
  getStatus: async (date: Date) => {
    const response = await api.get(`/api/reports/platforms/import/status/${format(date, 'yyyy-MM-dd')}`)
    return response.data.data as ImportStatus[]
  }
} 