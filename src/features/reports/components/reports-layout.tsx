import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconInfoCircle } from '@tabler/icons-react'

interface ReportsLayoutProps {
  children: React.ReactNode
}

export function ReportsLayout({ children }: ReportsLayoutProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Rapports de Paiement</h1>
        <p className="text-muted-foreground">
          Consultez les rapports de paiement
        </p>
      </div>

      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          Pour éviter les incohérences de données, veuillez importer les fichiers dans cet ordre :
          <ol className="mt-2 list-decimal list-inside">
            <li>Bolt (CSV)</li>
            <li>Uber (CSV)</li>
            <li>Heetch (PDF)</li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Importer un fichier</CardTitle>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>État des imports de la semaine</CardTitle>
            <p className="text-sm text-muted-foreground">
              03/03/2025 - 09/03/2025
            </p>
          </CardHeader>
          <CardContent>
            {/* Your PaginatedDataTable component will go here */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 