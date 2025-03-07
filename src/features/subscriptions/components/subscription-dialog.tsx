import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { subscriptionService } from '../data/subscription-service'
import { toast } from 'sonner'
import { type Subscription } from '../data/schema'
import { userService } from '@/features/users/data/user-service'
import { DatePicker } from '@/components/ui/date-picker'
import { StatusBadge } from '@/components/ui/status-badge'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription?: Subscription
}

const PLANS = [
  { id: '1', name: 'Basic', price: '99.99' },
  { id: '2', name: 'Premium', price: '199.99' }
]

export function SubscriptionDialog({ open, onOpenChange, subscription }: Props) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    user_id: subscription?.user_id || '',
    payment_status: subscription?.payment_status || 'active',
    start_date: subscription?.start_date || new Date(),
    end_date: subscription?.end_date || new Date(),
    amount: subscription?.amount || '',
    status: subscription?.status || 'active',
  })

  useEffect(() => {
    if (open) {
      setFormData({
        user_id: subscription?.user_id || '',
        payment_status: subscription?.payment_status || 'pending',
        start_date: subscription?.start_date || new Date(),
        end_date: subscription?.end_date || new Date(),
        amount: subscription?.amount || '',
        status: subscription?.status || 'active',
      })
    }
  }, [open, subscription])

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(1, ''),
    select: (data) => data.data
  })

  const createMutation = useMutation({
    mutationFn: subscriptionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast.success('Abonnement créé avec succès')
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de l\'abonnement', {
        description: error instanceof Error ? error.message : 'Une erreur est survenue'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subscription> }) =>
      subscriptionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast.success('Abonnement mis à jour avec succès')
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour de l\'abonnement', {
        description: error instanceof Error ? error.message : 'Une erreur est survenue'
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.user_id) {
      toast.error('Veuillez sélectionner un utilisateur')
      return
    }
    if (!formData.amount) {
      toast.error('Veuillez sélectionner un plan')
      return
    }

    if (subscription) {
      updateMutation.mutate({
        id: subscription.id,
        data: {
          user_id: formData.user_id,
          payment_status: formData.payment_status as "paid" | "pending" | "failed",
          start_date: formData.start_date,
          end_date: formData.end_date,
          amount: formData.amount,
          status: formData.status as "active" | "expired" | "canceled"
        }
      })
    } else {
      createMutation.mutate({
        user_id: formData.user_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        amount: formData.amount,
        status: 'active',
        payment_status: 'pending'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subscription ? 'Modifier l\'abonnement' : 'Nouvel abonnement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="userId">Utilisateur</Label>
            <Select
              value={formData.user_id?.toString()}
              onValueChange={(value) => {
                const selectedUser = usersResponse?.find(user => user.id.toString() === value)
                setFormData(prev => ({
                  ...prev,
                  user_id: value,
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
            <Label htmlFor="planId">Plan</Label>
            <Select
              value={formData.amount}
              onValueChange={(value) => {
                const plan = PLANS.find(p => p.price === value)
                setFormData({ 
                  ...formData, 
                  amount: plan?.price || ''
                })
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un plan" />
              </SelectTrigger>
              <SelectContent>
                {PLANS.map((plan) => (
                  <SelectItem key={plan.price} value={plan.price}>
                    {plan.name} - €{plan.price}/mois
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="block mb-2">Date de début</Label>
            <DatePicker
              value={formData.start_date instanceof Date ? formData.start_date : new Date(formData.start_date)}
              onChange={(date: Date | undefined) => setFormData({ ...formData, start_date: date || new Date() })}
              
            />
          </div>

          <div className="space-y-2">
            <Label className="block mb-2">Date de fin</Label>
            <DatePicker
              value={formData.end_date instanceof Date ? formData.end_date : new Date(formData.end_date)}
              onChange={(date: Date | undefined) => setFormData({ ...formData, end_date: date || new Date() })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut de paiement</Label>
            <Select
              value={formData.payment_status}
              onValueChange={(value: "paid" | "pending" | "failed") => 
                setFormData({ ...formData, payment_status: value })}
              required
            >
              <SelectTrigger>
                <SelectValue>
                  {formData.payment_status && (
                    <StatusBadge status={formData.payment_status as any} />
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">
                  <StatusBadge status="paid" />
                </SelectItem>
                <SelectItem value="pending">
                  <StatusBadge status="pending" />
                </SelectItem>
                <SelectItem value="failed">
                  <StatusBadge status="failed" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "expired" | "canceled") => 
                setFormData({ ...formData, status: value })}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="canceled">Annulé</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
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
              className="bg-[#01631b] hover:bg-[#01631b]/90"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {subscription ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 