import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { paymentReportService } from '@/features/payment-reports/data/payment-report-service'
import { startOfWeek,format, subWeeks } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ChartData {
  name: string
  bolt: number
  uber: number
  heetch: number
}

export function WeeklyComparisonChart() {
  const today = new Date()
  const weekStart = format(startOfWeek(today, { locale: fr }), 'yyyy-MM-dd')
  const lastWeekStart = format(startOfWeek(subWeeks(today, 1), { locale: fr }), 'yyyy-MM-dd')

  const { data: currentWeekData } = useQuery({
    queryKey: ['payment-report', weekStart],
    queryFn: () => paymentReportService.getAll(1, weekStart, '')
  })

  const { data: lastWeekData } = useQuery({
    queryKey: ['payment-report', lastWeekStart],
    queryFn: () => paymentReportService.getAll(1, lastWeekStart, '')
  })


  const chartData: ChartData[] = [
    {
      name: 'Semaine courante',
      bolt: currentWeekData?.data.reduce((acc, p) => acc + Number(p.bolt_earnings), 0) || 0,
      uber: currentWeekData?.data.reduce((acc, p) => {
        const earnings = Number(p.uber_earnings)
        return earnings >= 0 ? acc + earnings : acc
      }, 0) || 0,
      heetch: currentWeekData?.data.reduce((acc, p) => acc + Number(p.heetch_earnings), 0) || 0
    },
    {
      name: 'Semaine précédente',
      bolt: lastWeekData?.data.reduce((acc, p) => acc + Number(p.bolt_earnings), 0) || 0,
      uber: lastWeekData?.data.reduce((acc, p) => {
        const earnings = Number(p.uber_earnings)
        return earnings >= 0 ? acc + earnings : acc
      }, 0) || 0,
      heetch: lastWeekData?.data.reduce((acc, p) => acc + Number(p.heetch_earnings), 0) || 0
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison hebdomadaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `€${Number(value).toFixed(2)}`}
              />
              <Legend />
              <Bar name="Bolt" dataKey="bolt" fill="#008000" />
              <Bar name="Uber" dataKey="uber" fill="#000000" />
              <Bar name="Heetch" dataKey="heetch" fill="#FF385C" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 