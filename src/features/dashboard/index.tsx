import { useQuery } from '@tanstack/react-query'
import { driverService } from '@/features/drivers/data/driver-service'
import { startOfWeek, endOfWeek, format, subWeeks } from 'date-fns'
import { fr } from 'date-fns/locale'
import { importStatusService } from '@/features/reports/data/import-status-service'
import { paymentReportService } from '@/features/payment-reports/data/payment-report-service'
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
import { WeeklyComparisonChart } from './components/weekly-comparison-chart'
import { MonthlyRevenueChart } from './components/monthly-revenue-chart'
import type { PaymentReport } from '@/features/payment-reports/data/schema'


export default function Dashboard() {
  const today = new Date()
  const weekStart = format(startOfWeek(today, { locale: fr }), 'yyyy-MM-dd')
  const weekEnd = endOfWeek(today, { locale: fr })
  const lastWeekStart = startOfWeek(subWeeks(today, 1), { locale: fr })
 

  // Get drivers
  const { data: drivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => driverService.getAll(),
  })

  // Get current week payments
  const { data: currentWeekPayments } = useQuery({
    queryKey: ['payment-report', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () => paymentReportService.getAll(1, weekStart, '') // Get payments for current week
  })

 
  const { data: lastWeekPayments } = useQuery({
    queryKey: ['payment-report', format(lastWeekStart, 'yyyy-MM-dd')],
    queryFn: () => paymentReportService.getAll(1, format(lastWeekStart, 'yyyy-MM-dd'), '')
  })

  // Get import status
  const { data: importStatus } = useQuery({
    queryKey: ['import-status', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () => importStatusService.getStatus(new Date(weekStart))
  })

  // Calculate weekly revenue and commission
  const weeklyRevenue = currentWeekPayments?.data.reduce((acc: number, payment: PaymentReport) => acc + Number(payment.total_earnings), 0) || 0
  const lastWeekRevenue = lastWeekPayments?.data.reduce((acc: number, payment: PaymentReport) => acc + Number(payment.total_earnings), 0) || 0
  const weeklyRevenueChange = lastWeekRevenue ? ((weeklyRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 : 0

  // Calculate total commission and number of payments
  const totalCommission = currentWeekPayments?.data.reduce((acc: number, payment: PaymentReport) => acc + Number(payment.commission_amount), 0) || 0
  const totalPayments = currentWeekPayments?.data.length || 0

  // Calculate pending and successful imports
  const pendingImports = importStatus?.filter(status => status.uploaded === false).length || 0
  const successImports = importStatus?.filter(status => status.uploaded === true).length || 0

 
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
                <IconUsers className='h-8 w-8 text-muted-foreground' />
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
                <IconCash className='h-8 w-8 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  €{weeklyRevenue.toFixed(2)}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {weeklyRevenueChange.toFixed(1)}% vs semaine précédente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Commission totale</CardTitle>
                <IconTrendingUp className='h-8 w-8 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  €{totalCommission.toFixed(2)}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {totalPayments} paiements traités
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Importations en attente</CardTitle>
                <IconCalendar className='h-8 w-8 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{pendingImports}</div>
                <p className='text-xs text-muted-foreground'>
                  {successImports} importations validées
                </p>
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <WeeklyComparisonChart />
            <MonthlyRevenueChart />
          </div>
        </div>
      </Main>
    </>
  )
}


