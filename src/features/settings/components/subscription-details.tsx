import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconCreditCard } from '@tabler/icons-react'

export function SubscriptionDetails() {
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get('/api/subscriptions/current').then(res => res.data)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Plan actuel</p>
          <p className="text-sm text-muted-foreground">
            {subscription?.plan_name || 'Aucun abonnement'}
          </p>
        </div>
        <Badge variant={subscription ? 'success' : 'destructive'}>
          {subscription ? 'Actif' : 'Inactif'}
        </Badge>
      </div>

      <Button className="w-full" variant="outline">
        <IconCreditCard className="mr-2 h-4 w-4" />
        Gérer l'abonnement
      </Button>
    </div>
  )
} 