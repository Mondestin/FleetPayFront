import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconCreditCard, IconReceipt, IconPrinter } from '@tabler/icons-react'
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
import { Main } from '@/components/layout/main'


interface Invoice {
  id: string;
  issue_date: string;
  amount: string;
  status: 'paid' | 'pending';
}

export function SubscriptionDetails() {
  const { user } = useUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
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

  const handlePrintReceipt = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsReceiptDialogOpen(true)
  }

  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank')
    if (receiptWindow && selectedInvoice) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Facture #${selectedInvoice.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .receipt { max-width: 400px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin-bottom: 20px; }
              .total { font-weight: bold; margin-top: 20px; }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h2>FleetPay</h2>
                <p>Facture</p>
              </div>
              <div class="details">
                <p><strong>Numéro de facture:</strong> ${selectedInvoice.id}</p>
                <p><strong>Date:</strong> ${format(new Date(selectedInvoice.issue_date), 'dd/MM/yyyy')}</p>
                <p><strong>Client:</strong> ${user?.first_name} ${user?.last_name}</p>
                <p><strong>Email:</strong> ${user?.email}</p>
              </div>
              <div class="total">
                <p>Montant total: €${Number(selectedInvoice.amount).toFixed(2)}</p>
                <p>Statut: ${selectedInvoice.status === 'paid' ? 'Payée' : 'En attente'}</p>
              </div>
              <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">Imprimer</button>
              </div>
            </div>
          </body>
        </html>
      `)
      receiptWindow.document.close()
    }
  }

  return (
    <>
    <Main>
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

            <div className="flex gap-2 items-start justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-[#01631b] hover:bg-[#01631b]/90 text-white" 
                    variant="default"
                    style={{
                      textAlign: 'center',
                      border: 'none',
                      borderRadius: '0.25rem',
                      width: '11.625rem',
                      padding: '0 2rem',
                      height: '2.625rem',
                      fontWeight: 'bold',
                      fontFamily: '"Helvetica Neue",Arial,sans-serif',
                      fontSize: '1rem',
                      lineHeight: '1.25rem',
                      cursor: 'pointer'
                    }}
                  >
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

              {/* PayPal Payment Button */}
              <div>
                <form action="https://www.paypal.com/ncp/payment/WVZFHTXEU68NW" method="post" target="_blank" style={{display: 'inline-grid', justifyContent: 'center', alignContent: 'start', gap: '0.5rem'}}>
                  <input 
                    className="pp-WVZFHTXEU68NW" 
                    type="submit" 
                    value="Payer" 
                    style={{
                      textAlign: 'center',
                      border: 'none',
                      borderRadius: '0.25rem',
                      width: '11.625rem',
                      padding: '0 2rem',
                      height: '2.625rem',
                      fontWeight: 'bold',
                      backgroundColor: '#FFD140',
                      color: '#000000',
                      fontFamily: '"Helvetica Neue",Arial,sans-serif',
                      fontSize: '1rem',
                      lineHeight: '1.25rem',
                      cursor: 'pointer'
                    }}
                  />
                  <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" />
                </form>
              </div>
            </div>

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
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handlePrintReceipt(invoice)}
                          >
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

            {/* Receipt Dialog */}
            <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Facture</DialogTitle>
                  <DialogDescription>
                    Aperçu de la facture
                  </DialogDescription>
                </DialogHeader>
                {selectedInvoice && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Numéro de facture</p>
                        <p className="font-medium">{selectedInvoice.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {format(new Date(selectedInvoice.issue_date), 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Montant</p>
                        <p className="font-medium">€{Number(selectedInvoice.amount).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Statut</p>
                        <Badge variant={selectedInvoice.status === 'paid' ? 'success' : 'destructive'}>
                          {selectedInvoice.status === 'paid' ? 'Payée' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={printReceipt} className="bg-[#01631b] hover:bg-[#01631b]/90">
                    <IconPrinter className="mr-2 h-4 w-4" />
                    Imprimer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
    </Main>
    </>
  )
} 