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
import { IconInfoCircle, IconAlertCircle } from '@tabler/icons-react'
import { importStatusService } from './data/import-status-service'
import { useState } from 'react'
import { useUser } from '@/features/auth/hooks/use-user'

export default function FilesManager() {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const weekStart = startOfWeek(selectedWeek, { locale: fr })
  
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get(`/api/subscriptions/${user?.id}/current`).then(res => res.data)
  })

  const { data: importStatus } = useQuery({
    queryKey: ['import-status', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () => importStatusService.getStatus(weekStart)
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

  const handleWeekChange = (date: Date) => {
    setSelectedWeek(date)
  }

  const isExpired = subscription ? new Date(subscription.end_date) < new Date() : false


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
          <div className='flex mt-4'>
            <div className='w-1/2 mr-4'>
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
              <div className='w-1/2 ml-4'>
                <Alert className='border-l-4 border-[#ffa500]'>
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertDescription>
                     <span className='font-bold'>Attention :</span>
                     <br />   
                     La semaine commence le <span className='font-bold'>lundi</span> et se termine le <span className='font-bold'>dimanche</span>.
                     <br />
                     <br />
                     <span className='font-bold'>Afin d'éviter les erreurs de comptabilité, veuillez exporter les données pour Uber conformément à cette consigne.</span>
                  </AlertDescription>
                </Alert>
            
            </div>
          </div>
        </div>
        <div className='space-y-8'>
          <div className='grid grid-cols-1 gap-4'>
            <UploadStatusTable 
              uploadStatus={uploadStatus} 
              onDeleteUpload={handleDeleteUpload}
              weekStart={selectedWeek}
            />
            {isExpired ? (
              <Alert variant="destructive">
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Votre abonnement a expiré le {format(new Date(subscription?.end_date || ''), 'dd/MM/yyyy', { locale: fr })}. 
                  Veuillez renouveler votre abonnement pour continuer à importer des rapports.
                </AlertDescription>
              </Alert>
            ) : (
              <ImportForm 
                uploadStatus={uploadStatus} 
                selectedWeek={selectedWeek}
                onWeekChange={handleWeekChange}
              />
            )}
          </div>
        </div>
      </Main>
    </>
  )
} 