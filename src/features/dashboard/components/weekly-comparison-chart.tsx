import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { paymentReportService } from '@/features/payment-reports/data/payment-report-service'
import { startOfWeek, format, subWeeks } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ChartData {
  name: string
  bolt: number
  uber: number
  heetch: number
}

interface Props {
  selectedWeek: Date
}

export function WeeklyComparisonChart({ selectedWeek }: Props) {
  const weekStart = format(startOfWeek(selectedWeek, { locale: fr }), 'yyyy-MM-dd')
  const lastWeekStart = format(startOfWeek(subWeeks(selectedWeek, 1), { locale: fr }), 'yyyy-MM-dd')
  const twoWeeksAgoStart = format(startOfWeek(subWeeks(selectedWeek, 2), { locale: fr }), 'yyyy-MM-dd')

  const { data: currentWeekPayments } = useQuery({
    queryKey: ['payment-report', weekStart],
    queryFn: () => paymentReportService.getAll(weekStart, '')
  })

  const { data: lastWeekPayments } = useQuery({
    queryKey: ['payment-report', lastWeekStart],
    queryFn: () => paymentReportService.getAll(lastWeekStart, '')
  })

  const { data: twoWeeksAgoPayments } = useQuery({
    queryKey: ['payment-report', twoWeeksAgoStart],
    queryFn: () => paymentReportService.getAll(twoWeeksAgoStart, '')
  })

  const calculateWeeklyData = (payments: any) => {
    if (!payments?.data) return { bolt: 0, uber: 0, heetch: 0 }
    
    return payments.data.reduce(
      (acc: { bolt: number; uber: number; heetch: number }, payment: any) => {
        acc.bolt += Number(payment.bolt_earnings)
        // Only include non-negative Uber earnings
        if (Number(payment.uber_earnings) >= 0) {
          acc.uber += Number(payment.uber_earnings)
        }
        acc.heetch += Number(payment.heetch_earnings)
        return acc
      },
      { bolt: 0, uber: 0, heetch: 0 }
    )
  }

  const currentWeekData = calculateWeeklyData(currentWeekPayments)
  const lastWeekData = calculateWeeklyData(lastWeekPayments)
  const twoWeeksAgoData = calculateWeeklyData(twoWeeksAgoPayments)

  const chartData: ChartData[] = [
    {
      name: 'Il y a 2 semaines',
      ...twoWeeksAgoData
    },
    {
      name: 'Semaine dernière',
      ...lastWeekData
    },
    {
      name: 'Cette semaine',
      ...currentWeekData
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison hebdomadaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `€${value.toFixed(2)}`}
              />
              <Legend />
              <Bar dataKey="bolt" name="Bolt" fill="#008000" />
              <Bar dataKey="uber" name="Uber" fill="#000000" />
              <Bar dataKey="heetch" name="Heetch" fill="#FF385C" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 