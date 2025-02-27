import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertCircle, Clock, Users, UserRoundCog, UserRoundCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'active' | 'inactive' | 'pending' | 'expired' | 'canceled' | 'paid' | 'admin' | 'superadmin' | 'user' | 'imported' | 'failed' | 'manager' | 'overdue'

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusConfig = {
  //implement the badge for roles here 

  admin: {
    icon: Users,
    variant: 'success',
    label: 'Administrateur'
  },
  superadmin: {
    icon: UserRoundCog,
    variant: 'success',
    label: 'Administrateur'
  },
  user: {
    icon: UserRoundCheck,
    variant: 'success',
    label: 'Chauffeur'
  },
  active: {
    icon: CheckCircle2,
    variant: 'success',
    label: 'Actif'
  },
  inactive: {
    icon: XCircle,
    variant: 'destructive',
    label: 'Inactif'
  },
  pending: {
    icon: Clock,
    variant: 'warning',
    label: 'En attente'
  },
  expired: {
    icon: AlertCircle,
    variant: 'destructive',
    label: 'Expiré'
  },
  paid: {
    icon: CheckCircle2,
    variant: 'success',
    label: 'Payée'
  },
  canceled: {
    icon: XCircle,
    variant: 'destructive',
    label: 'Annulé'
  },
  imported: {
    icon: CheckCircle2,
    variant: 'success',
    label: 'Importé'
  },
  failed: {
    icon: XCircle,
    variant: 'destructive',
    label: 'Échoué'
  },
  manager: {
    icon: UserRoundCheck,
    variant: 'success',
    label: 'Manager Fleet'
  },
  overdue: {
    icon: AlertCircle,
    variant: 'destructive',
    label: 'En retard'
  }

} as const

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge 
      variant={config.variant} 
      className={cn('gap-1', className)}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  )
} 