import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconCreditCard, IconReceipt } from '@tabler/icons-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useUser } from '@/features/auth/hooks/use-user'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Invoice {
  id: string;
  issue_date: string;
  amount: string;
  status: 'paid' | 'pending';
}

export function SubscriptionDetails() {
  const { user } = useUser()
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await api.get(`/api/subscriptions/${user?.id}/current`)
      return response.data
    }
     
  }
)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="font-medium">Plan actuel</p>
            <p className="text-sm text-muted-foreground">
              {subscription?.plan_name || 'Pro'}
            </p>
          </div>
          <div className="flex items-center justify-start">
            <Badge variant={subscription ? 'success' : 'destructive'}>
              {subscription ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
        </div>

        {subscription && (
          <>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-muted-foreground">Date de début</p>
                <p className="font-medium">
                  {format(new Date(subscription.start_date), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de fin</p>
                <p className="font-medium">
                  {format(new Date(subscription.end_date), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Montant mensuel</p>
                <p className="font-medium">€{Number(subscription.amount).toFixed(2)}</p>
              </div>
            </div>

            <div className=" pt-4 ">
              <p className="font-medium mb-3">Historique des factures</p>

              {subscription.invoices && subscription.invoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscription.invoices.map((invoice: Invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          {format(new Date(invoice.issue_date), 'dd/MM/yyyy ')}
                        </TableCell>
                        <TableCell>€{Number(invoice.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === 'paid' ? 'success' : 'destructive'}>
                            {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <IconReceipt className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune facture disponible</p>
              )}
            </div>
          </>
        )}
      </div>

      <Button className="w-full" variant="outline">
        <IconCreditCard className="mr-2 h-4 w-4" />
        Gérer l'abonnement
      </Button>
    </div>
  )
} 