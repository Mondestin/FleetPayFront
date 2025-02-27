import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { invoiceService } from '../data/invoice-service'
import { toast } from 'sonner'
import { type Invoice } from '../data/schema'
import { userService } from '@/features/users/data/user-service'
import { DatePicker } from '@/components/ui/date-picker'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice
}

export function InvoiceDialog({ open, onOpenChange, invoice }: Props) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    userId: invoice?.user_id || '',
    userName: invoice?.user.first_name + ' ' + invoice?.user.last_name || '',
    amount: invoice?.amount || 0,
    status: invoice?.status || 'pending',
    date: invoice?.issue_date || new Date(),
    dueDate: invoice?.due_date || new Date(),
  })

  useEffect(() => {
    if (open) {
      setFormData({
        userId: invoice?.user_id || '',
        userName: invoice?.user.first_name + ' ' + invoice?.user.last_name || '',
        amount: invoice?.amount || 0,
        status: invoice?.status || 'pending',
        date: invoice?.issue_date || new Date(),
        dueDate: invoice?.due_date || new Date(),
      })
    }
  }, [open, invoice])

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(1, ''),
    select: (data) => data.data
  })

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
      updateMutation.mutate({ 
        id: invoice.id,
        data: {
          user_id: formData.userId,
          amount: formData.amount.toString(),
          status: formData.status,
          issue_date: formData.date,
          due_date: formData.dueDate
        }
      })
    } else {
      createMutation.mutate({
        user_id: formData.userId,
        amount: formData.amount.toString(),
        status: formData.status,
        issue_date: formData.date,
        due_date: formData.dueDate,
        invoice_number: ''
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Modifier la facture' : 'Créer une facture'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">Utilisateur</Label>
            <Select
              value={formData.userId?.toString()}
              onValueChange={(value) => {
                const selectedUser = usersResponse?.find(user => user.id.toString() === value)
                setFormData(prev => ({
                  ...prev,
                  userId: value,
                  userName: selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ''
                }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {usersResponse?.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.first_name} {user.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label className="block mb-2">Date de facturation</Label>
            <DatePicker
              value={formData.date instanceof Date ? formData.date : new Date(formData.date)}
              onChange={(date) => setFormData({ ...formData, date: date || new Date() })}
            />
          </div>

          <div className="space-y-2">
            <Label className="block mb-2">Date d'échéance</Label>
            <DatePicker
              value={formData.dueDate instanceof Date ? formData.dueDate : new Date(formData.dueDate)}
              onChange={(date) => setFormData({ ...formData, dueDate: date || new Date() })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "paid" | "pending" | "pending") => 
                setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Payée</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-[#01631b] hover:bg-[#01631b]/90"
            >
              {invoice ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 