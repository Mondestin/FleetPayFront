import { type Subscription } from '../data/schema'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { subscriptionService } from '../data/subscription-service'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSearch, IconEdit, IconTrash, IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { SubscriptionDialog } from './subscription-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

export function SubscriptionsList() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>()

  const { data: paginatedSubscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions', currentPage, search],
    queryFn: () => subscriptionService.getAll(currentPage, search),
    placeholderData: keepPreviousData
  })

  // Add debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un abonnement..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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

      <div className="rounded-lg border shadow-sm">
        {!isLoading && paginatedSubscriptions ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Date de début</TableHead>
                  <TableHead>Date de fin</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubscriptions.data.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      {subscription.user.first_name} {subscription.user.last_name}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={subscription.status} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={subscription.payment_status} />
                       
                    </TableCell>
                    <TableCell>
                      {format(new Date(subscription.start_date), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(subscription.end_date), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>€{Number(subscription.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(subscription)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(subscription)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {paginatedSubscriptions.total > 0 ? (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={paginatedSubscriptions.current_page === 1}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.ceil(paginatedSubscriptions.total / paginatedSubscriptions.per_page) }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={paginatedSubscriptions.current_page === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={paginatedSubscriptions.current_page >= Math.ceil(paginatedSubscriptions.total / paginatedSubscriptions.per_page)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Aucun abonnement trouvé
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-red-500">
            Erreur lors du chargement des données
          </div>
        )}
      </div>

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