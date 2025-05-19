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

interface Props {
  selectedWeek: Date
}

const COLORS = ['#008000', '#000000', '#FF385C']

export function MonthlyRevenueChart({ selectedWeek }: Props) {
  const weekStart = format(startOfWeek(selectedWeek, { locale: fr }), 'yyyy-MM-dd')

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
          <ResponsiveContainer width="100%" height="100%" className="mt-5">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ percent, x, y }) => {
                  // Only show label if the segment is large enough
                  if (percent < 0.05) return null;
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `€${Number(value).toFixed(2)}`}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow-sm">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm">€{Number(data.value).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                formatter={(value, entry: any) => (
                  <span className="text-sm">
                    {value} ({((entry.payload?.value || 0) / chartData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1)}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 