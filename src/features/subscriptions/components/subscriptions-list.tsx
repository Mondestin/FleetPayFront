import { type Subscription } from '../data/schema'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { subscriptionService } from '../data/subscription-service'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSearch, IconEdit, IconTrash, IconPlus, IconEye } from '@tabler/icons-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { SubscriptionDialog } from './subscription-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PaginatedDataTable } from '@/features/shared/components/PaginatedDataTable'
import { type Column } from '@/features/shared/components/DataTable'
import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useNavigate } from '@tanstack/react-router'



export function SubscriptionsList() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>()
  const navigate = useNavigate()
 

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Reset to first page on search
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: paginatedSubscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions', currentPage, search],
    queryFn: () => subscriptionService.getAll(currentPage, search),
    placeholderData: keepPreviousData
  })

  const deleteMutation = useMutation({
    mutationFn: subscriptionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast.success('Abonnement supprimé avec succès')
      setDeleteDialogOpen(false)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setDialogOpen(true)
  }

  const handleDelete = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setDeleteDialogOpen(true)
  }

  const handleShow = (subscription: Subscription) => {
    navigate({ to: `/subscription/${subscription.id}` })
    
  }

  const columns: Column<Subscription>[] = [
    {
      header: '#',
      accessorKey: 'user.last_name' as keyof Subscription,
      cell: (row: Subscription) => (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {row.user.last_name[0]}{row.user.first_name[0]}
          </AvatarFallback>
        </Avatar>
      )
    },
    {
      header: 'Client',
      accessorKey: 'user',
      cell: (row: Subscription) => `${row.user.first_name} ${row.user.last_name}`
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: (row: Subscription) => <StatusBadge status={row.status} />
    },
    {
      header: 'Paiement',
      accessorKey: 'payment_status',
      cell: (row: Subscription) => <StatusBadge status={row.payment_status} />
    },
    {
      header: 'Date de début',
      accessorKey: 'start_date',
      cell: (row: Subscription) => format(new Date(row.start_date), 'dd MMM yyyy', { locale: fr })
    },
    {
      header: 'Date de fin',
      accessorKey: 'end_date',
      cell: (row: Subscription) => format(new Date(row.end_date), 'dd MMM yyyy', { locale: fr })
    },
    {
      header: 'Prix',
      accessorKey: 'amount',
      cell: (row: Subscription) => `€${Number(row.amount).toFixed(2)}`
    }
  ]

 
  const actions = (row: Subscription) => (
    <div className="flex items-center gap-2">
      <Button 
        size="sm"
        variant="ghost"
        onClick={() => handleShow(row)}
        className="text-gray-500 hover:text-gray-600 hover:bg-gray-50"
      >
        <IconEye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-gray-600 hover:bg-gray-50"
        onClick={() => handleEdit(row)}
      >
        <IconEdit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={() => handleDelete(row)}
      >
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="space-y-4 p-4 rounded-lg border shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un abonnement..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex justify-end ml-auto">
          <Button
            onClick={() => {
              setSelectedSubscription(undefined)
              setDialogOpen(true)
            }}
            className="bg-[#01631b] hover:bg-[#01631b]/90"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Nouvel abonnement
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : paginatedSubscriptions ? (
        <PaginatedDataTable
          data={paginatedSubscriptions.data}
          columns={columns}
          actions={actions}
          searchable={true}
          searchKeys={['status', 'payment_status']}
        />
      ) : (
        <div className="text-center py-4 text-red-500">
          Erreur lors du chargement des données
        </div>
      )}

      <SubscriptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subscription={selectedSubscription}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer l'abonnement"
        description={`Êtes-vous sûr de vouloir supprimer cet abonnement ?`}
        onConfirm={() => {
          if (selectedSubscription) {
            deleteMutation.mutate(selectedSubscription.id)
          }
        }}
      />
    </div>
  )
} 