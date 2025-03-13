import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const dummyData = [
  { month: 'Jan', total: 7500.50, bolt: 2500.25, uber: 3200.75, heetch: 1800.50 },
  { month: 'Fév', total: 8200.75, bolt: 2800.50, uber: 3500.25, heetch: 1900.00 },
  { month: 'Mar', total: 9100.25, bolt: 3100.75, uber: 3800.50, heetch: 2200.00 },
  { month: 'Avr', total: 8800.50, bolt: 2900.25, uber: 3700.75, heetch: 2200.50 },
  { month: 'Mai', total: 9500.75, bolt: 3200.50, uber: 4000.25, heetch: 2300.00 },
  { month: 'Juin', total: 10200.25, bolt: 3500.75, uber: 4300.50, heetch: 2400.00 },
]

export function MonthlyRevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenus mensuels</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `€${Number(value).toFixed(2)}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                name="Total" 
                dataKey="total" 
                stroke="#01631b" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                name="Bolt" 
                dataKey="bolt" 
                stroke="#00c3f7" 
              />
              <Line 
                type="monotone" 
                name="Uber" 
                dataKey="uber" 
                stroke="#000000" 
              />
              <Line 
                type="monotone" 
                name="Heetch" 
                dataKey="heetch" 
                stroke="#e502a4" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 