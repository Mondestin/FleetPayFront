import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { invoiceService } from '../data/invoice-service'
import { subscriptionService } from '@/features/subscriptions/data/subscription-service'
import { type Invoice } from '../data/schema'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice
}

type InvoiceFormData = {
  subscription_id: string
  invoice_number: string
  amount: number
  status: 'pending' | 'paid' | 'overdue'
  issue_date: string
  due_date: string
}

export function InvoiceDialog({ open, onOpenChange, invoice }: Props) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<InvoiceFormData>({
    subscription_id: '',
    invoice_number: '',
    amount: 0,
    status: 'pending',
    issue_date: '',
    due_date: '',
  })

  // Fetch subscriptions for the select dropdown
  const { data: subscriptions } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionService.getAll(),
  })

  useEffect(() => {
    if (open && invoice) {
      setFormData({
        subscription_id: invoice.subscription_id,
        invoice_number: invoice.invoice_number,
        amount: Number(invoice.amount),
        status: invoice.status,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
      })
    } else if (open) {
      setFormData({
        subscription_id: '',
        invoice_number: '',
        amount: 0,
        status: 'pending',
        issue_date: '',
        due_date: '',
      })
    }
  }, [open, invoice])

  const createMutation = useMutation({
    mutationFn: invoiceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Facture créée avec succès')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Erreur lors de la création')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Invoice> }) =>
      invoiceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Facture mise à jour avec succès')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (invoice) {
      updateMutation.mutate({ id: invoice.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Modifier la facture' : 'Créer une facture'}
          </DialogTitle>
          <DialogDescription>
            {invoice
              ? 'Modifiez les informations de la facture ci-dessous.'
              : 'Remplissez les informations de la facture ci-dessous.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subscription_id">Abonnement</Label>
            <Select
              value={formData.subscription_id}
              onValueChange={(value) =>
                setFormData({ ...formData, subscription_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un abonnement" />
              </SelectTrigger>
              <SelectContent>
                {subscriptions?.data.map((subscription) => (
                  <SelectItem key={subscription.id} value={subscription.id}>
                    {subscription.user.first_name} {subscription.user.last_name} - {subscription.amount}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!formData.subscription_id && (
              <p className="text-sm text-red-500">Veuillez sélectionner un abonnement</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue_date">Date d'émission</Label>
            <Input
              id="issue_date"
              type="date"
              value={formData.issue_date}
              onChange={(e) =>
                setFormData({ ...formData, issue_date: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Date d'échéance</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'pending' | 'paid' | 'overdue') =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="paid">Payée</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#01631b] hover:bg-[#01631b]/90"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Enregistrement...'
                : invoice
                ? 'Mettre à jour'
                : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 