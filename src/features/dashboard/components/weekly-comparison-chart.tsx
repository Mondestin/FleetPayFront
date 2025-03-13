import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const dummyData = [
  { name: 'Bolt', current: 2450.50, previous: 2100.75 },
  { name: 'Uber', current: 3200.25, previous: 2800.50 },
  { name: 'Heetch', current: 1800.75, previous: 1650.25 },
]

export function WeeklyComparisonChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison hebdomadaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `€${Number(value).toFixed(2)}`}
              />
              <Legend />
              <Bar name="Semaine courante" dataKey="current" fill="#01631b" />
              <Bar name="Semaine précédente" dataKey="previous" fill="#e2e8f0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 