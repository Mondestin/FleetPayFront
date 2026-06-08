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
        {/* Page header */}
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>Imports de données</h2>
          <p className='text-sm text-muted-foreground'>
            Importez les rapports hebdomadaires par plateforme
          </p>
        </div>

        {/* Info alerts at the top */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6'>
          <Alert className='border-l-4 border-[#01631b] bg-[#01631b]/5'>
            <IconInfoCircle className='h-4 w-4 text-[#01631b]' />
            <AlertDescription className='text-sm'>
              Pour éviter les incohérences de données, importez les fichiers dans cet ordre :
              <ol className='mt-2 space-y-1 list-decimal list-inside'>
                <li>Bolt <span className='text-muted-foreground'>(CSV)</span></li>
                <li>Uber <span className='text-muted-foreground'>(CSV)</span></li>
                <li>Heetch <span className='text-muted-foreground'>(PDF ou CSV)</span></li>
              </ol>
            </AlertDescription>
          </Alert>

          <Alert className='border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20'>
            <IconAlertCircle className='h-4 w-4 text-amber-500' />
            <AlertDescription className='text-sm'>
              <span className='font-semibold'>Attention :</span> la semaine commence le{' '}
              <span className='font-semibold'>lundi</span> et se termine le{' '}
              <span className='font-semibold'>dimanche</span>.{' '}
              Exportez les données Uber en respectant cette période.
            </AlertDescription>
          </Alert>
        </div>

        {/* 2-column layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
          {/* Left column — status */}
          <div>
            <UploadStatusTable
              uploadStatus={uploadStatus}
              onDeleteUpload={handleDeleteUpload}
              weekStart={selectedWeek}
            />
          </div>

          {/* Right column — import form */}
          <div>
            {isExpired ? (
              <Alert variant='destructive'>
                <IconAlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Votre abonnement a expiré le{' '}
                  {format(new Date(subscription?.end_date || ''), 'dd/MM/yyyy', { locale: fr })}.{' '}
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

        {/* Preview tables below */}
        <div className='mt-6' id='data-preview' />
      </Main>
    </>
  )
}
