import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react'
import { toast } from 'sonner'

interface Invoice {
  id: string;
  issue_date: string;
  amount: string;
  status: 'paid' | 'pending';
}

export function SubscriptionDetails() {
  const { user } = useUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const calculateRemainingDays = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get(`/api/subscriptions/${user?.id}/current`).then(res => res.data)
  })

  const updateSubscriptionMutation = useMutation({
      mutationFn: (action: 'cancel' | 'resume') => 
      api.put(`/api/subscriptions/${user?.id}/${action}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      setIsDialogOpen(false)
      toast.success('Abonnement mis à jour avec succès')
    },
    onError: () => {
      toast.error('Une erreur est survenue lors de la mise à jour de l\'abonnement')
    }
  })

  const handleSubscriptionAction = (action: 'cancel' | 'resume') => {
    updateSubscriptionMutation.mutate(action)
  }

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
            <Badge variant={subscription?.status === 'active' ? 'success' : subscription?.status === 'expired' ? 'destructive' : 'warning'}>
              {subscription?.status === 'active' ? 'Actif' : subscription?.status === 'expired' ? 'Expiré' : 'Annulé'}
            </Badge>
            <span className="ml-2"></span>
            {subscription?.status === 'canceled' && (
              <span className="text-xs text-muted-foreground">
                Votre abonnement prendra fin dans{' '}
                <span className="font-bold text-red-500">
                  {calculateRemainingDays(subscription.end_date)} jours
                </span>
              </span>
            )}
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <IconCreditCard className="mr-2 h-4 w-4" />
                  Gérer l'abonnement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Gérer l'abonnement</DialogTitle>
                  <DialogDescription>
                    {subscription.status === 'active' ? (
                      'Vous pouvez annuler ou mettre à jour votre abonnement actuel.'
                    ) : (
                      'Vous pouvez reprendre votre abonnement.'
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2">
                  {subscription.status === 'active' ? (
                    <>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleSubscriptionAction('cancel')}
                        disabled={updateSubscriptionMutation.isPending}
                      >
                        Annuler l'abonnement
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => handleSubscriptionAction('resume')}
                      disabled={updateSubscriptionMutation.isPending}
                      className="bg-[#01631b] hover:bg-[#01631b]/90"
                    >
                      Reprendre l'abonnement
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="pt-4">
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
    </div>
  )
} 