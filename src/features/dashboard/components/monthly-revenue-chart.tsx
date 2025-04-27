import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { paymentReportService } from '@/features/payment-reports/data/payment-report-service'
import { startOfWeek, format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ChartData {
  name: string
  value: number
}

const COLORS = ['#008000', '#000000', '#FF385C']

export function MonthlyRevenueChart() {
  const today = new Date()
  const weekStart = format(startOfWeek(today, { locale: fr }), 'yyyy-MM-dd')

  //get the current week start date
  const { data: currentWeekData } = useQuery({
    queryKey: ['payment-report', weekStart],
    queryFn: () => paymentReportService.getAll(weekStart, '')
  })

  //filter the data to get only the data for the current week
  const chartData: ChartData[] = [
    {
      name: 'Bolt',
        value: currentWeekData?.data.reduce((acc, p) => acc + Number(p.bolt_earnings), 0) || 0
    },
    {
      name: 'Uber',
      value: currentWeekData?.data.reduce((acc, p) => {
        const earnings = Number(p.uber_earnings)
        return earnings >= 0 ? acc + earnings : acc
      }, 0) || 0
    },
    {
      name: 'Heetch',
      value: currentWeekData?.data.reduce((acc, p) => acc + Number(p.heetch_earnings), 0) || 0
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution des revenus du mois</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `€${Number(value).toFixed(2)}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 