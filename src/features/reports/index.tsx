import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { UploadStatusTable } from './components/upload-status-table'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { startOfWeek, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ImportForm } from './components/import-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconInfoCircle } from '@tabler/icons-react'

interface ImportStatus {
  platform: 'uber' | 'bolt' | 'heetch'
  uploaded: boolean
  weekStartDate: string
}

export default function FilesManager() {
  const queryClient = useQueryClient()
  const weekStart = startOfWeek(new Date(), { locale: fr })
  
  const { data: importStatus } = useQuery({
    queryKey: ['import-status', format(weekStart, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await api.get(`/api/reports/platforms/import/status/${format(weekStart, 'yyyy-MM-dd')}`)
      return response.data.data as ImportStatus[]
    }
  })

  const uploadStatus = importStatus?.map(status => ({
    platform: status.platform,
    uploaded: status.uploaded,
    validated: status.uploaded,
  })) ?? []

  const handleDeleteUpload = async (platform: string) => {
    await api.delete(`/api/reports/platforms/import/${platform}/${format(weekStart, 'yyyy-MM-dd')}`)
    queryClient.invalidateQueries({ queryKey: ['import-status'] })
  }

  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-4 items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Rapports de Paiement</h2>
            <p className="text-muted-foreground">
              Consultez les rapports de paiement
            </p>
          </div>
          <div className='row mt-4'>
          
 
          <Alert className='border-l-4 border-[#01631b]'>
            <IconInfoCircle className="h-4 w-4" />
            <AlertDescription>
              Pour éviter les incohérences de données, veuillez importer les fichiers dans cet ordre :
              <ol className="mt-2 list-decimal">
                <li> Bolt (CSV) </li>
                <li> Uber (CSV) </li>
                <li> Heetch (PDF) </li>
              </ol>
            </AlertDescription>
          </Alert>
          </div>
        </div>
        <div className='space-y-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <UploadStatusTable 
              uploadStatus={uploadStatus} 
              onDeleteUpload={handleDeleteUpload}
              weekStart={new Date()}
            />
            <ImportForm uploadStatus={uploadStatus} />
           
          </div>
        </div>
      </Main>
    </>
  )
} 