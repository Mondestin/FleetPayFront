import { ReportsLayout } from '../components/reports-layout'
import { ImportForm } from '../components/import-form'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function ReportsPage() {
  const { data: uploadStatus = [] } = useQuery({
    queryKey: ['import-status'],
    queryFn: () => api.get('/api/reports/import-status').then(res => res.data)
  })

  return (
    <ReportsLayout>
      <ImportForm uploadStatus={uploadStatus} />
    </ReportsLayout>
  )
} 