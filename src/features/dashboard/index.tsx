import { useQuery } from '@tanstack/react-query'
import { driverService } from '@/features/drivers/data/driver-service'
import { startOfWeek, endOfWeek, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { IconUsers, IconCash, IconTrendingUp, IconCalendar } from '@tabler/icons-react'

export default function Dashboard() {
  const today = new Date()
  const weekStart = startOfWeek(today, { locale: fr })
  const weekEnd = endOfWeek(today, { locale: fr })

  const { data: drivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => driverService.getAll(),
  })



  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='flex flex-col gap-6'>
          <div>
            <h1 className='text-3xl font-bold'>Tableau de bord</h1>
            <p className='text-muted-foreground'>
              Semaine du {format(weekStart, 'dd/MM/yyyy')} au {format(weekEnd, 'dd/MM/yyyy')}
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Chauffeurs actifs</CardTitle>
                <IconUsers className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{drivers?.total || 0}</div>
                <p className='text-xs text-muted-foreground'>
                  {drivers?.data.filter(d => d.status === 'active').length || 0} actifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Revenus hebdomadaires</CardTitle>
                <IconCash className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  €{0 || '0.00'}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {0 || 0}
                  {0}% vs semaine précédente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Commission totale</CardTitle>
                <IconTrendingUp className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  €{0 || '0.00'}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {0 || 0} paiements traités
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Importations en attente</CardTitle>
                <IconCalendar className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{0 || 0}</div>
                <p className='text-xs text-muted-foreground'>
                  {0} importations cette semaine
                </p>
              </CardContent>
            </Card>
          </div>
          {/*
          {alerts && alerts.length > 0 && (
            <Card className='border-orange-200 bg-orange-50 dark:bg-orange-950'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <IconAlertTriangle className='h-5 w-5 text-orange-500' />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  {alerts.map((alert: any, index: number) => (
                    <li key={index} className='text-sm text-orange-700 dark:text-orange-300'>
                      {alert.message}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          */}
        </div>
      </Main>
    </>
  )
}


