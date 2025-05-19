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
import { WeekPicker } from '@/components/ui/week-picker'
import { useState } from 'react'


export default function Dashboard() {
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const weekStart = format(startOfWeek(selectedWeek, { locale: fr }), 'yyyy-MM-dd')
  const weekEnd = endOfWeek(selectedWeek, { locale: fr })
  const lastWeekStart = format(startOfWeek(subWeeks(selectedWeek, 1), { locale: fr }), 'yyyy-MM-dd')
 
  // Get drivers
  const { data: drivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => driverService.getAll(),
  })

  // Get current week payments
  const { data: currentWeekPayments } = useQuery({
    queryKey: ['payment-report', weekStart],
    queryFn: () => paymentReportService.getAll(weekStart, '') // Get payments for current week
  })

  // Get last week payments
  const { data: lastWeekPayments } = useQuery({
    queryKey: ['payment-report', lastWeekStart],
    queryFn: () => paymentReportService.getAll(lastWeekStart, '')
  })

  // Get import status
  const { data: importStatus } = useQuery({
    queryKey: ['import-status', weekStart],
    queryFn: () => importStatusService.getStatus(new Date(weekStart))
  })

  // Calculate weekly revenue and commission
  const weeklyRevenue = currentWeekPayments?.data.reduce((acc, p) => {
    const boltEarnings = Number(p.bolt_earnings)
    const uberEarnings = Number(p.uber_earnings)
    const heetchEarnings = Number(p.heetch_earnings)
    return acc + boltEarnings + (uberEarnings >= 0 ? uberEarnings : 0) + heetchEarnings
  }, 0) || 0

  const lastWeekRevenue = lastWeekPayments?.data.reduce((acc, p) => {
    const boltEarnings = Number(p.bolt_earnings)
    const uberEarnings = Number(p.uber_earnings)
    const heetchEarnings = Number(p.heetch_earnings)
    return acc + boltEarnings + (uberEarnings >= 0 ? uberEarnings : 0) + heetchEarnings
  }, 0) || 0

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className='text-3xl font-bold'>Tableau de bord</h1>
              <p className='text-muted-foreground'>
                Semaine du {format(new Date(weekStart), 'dd/MM/yyyy')} au {format(weekEnd, 'dd/MM/yyyy')}
              </p>
            </div>
            <WeekPicker 
              date={selectedWeek}
              onDateChange={setSelectedWeek}
            />
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
            <WeeklyComparisonChart selectedWeek={selectedWeek} />
            <MonthlyRevenueChart selectedWeek={selectedWeek} />
          </div>
        </div>
      </Main>
    </>
  )
}


