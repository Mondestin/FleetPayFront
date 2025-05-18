import { useState } from 'react'
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invoiceService } from '../data/invoice-service'
import { type Invoice } from '../data/schema'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconPlus, IconSearch, IconEdit, IconTrash } from '@tabler/icons-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PaginatedDataTable } from '@/features/shared/components/PaginatedDataTable'
import { formatDate } from '@/lib/utils'
import { InvoiceDialog } from './invoice-dialog'
import { Spinner } from '@/components/ui/spinner'

type StatusMap = {
  pending: { label: string; className: string }
  paid: { label: string; className: string }
  overdue: { label: string; className: string }
}

const statusMap: StatusMap = {
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Payée', className: 'bg-green-100 text-green-800' },
  overdue: { label: 'En retard', className: 'bg-red-100 text-red-800' },
}

export function InvoicesList() {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>()
  const queryClient = useQueryClient()

  const { data: paginatedInvoices, isLoading } = useQuery({
    queryKey: ['invoices', search],
    queryFn: () => invoiceService.getAll(search),
    placeholderData: keepPreviousData
  })

  const deleteMutation = useMutation({
    mutationFn: invoiceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Facture supprimée avec succès')
      setDeleteDialogOpen(false)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    },
  })

  const columns = [
    {
      header: 'Numéro',
      accessorKey: 'invoice_number',
      cell: (row: Invoice) => row.invoice_number,
    },
    {
      header: 'Client',
      accessorKey: 'subscription.user',
      cell: (row: Invoice) => `${row.subscription.user.first_name} ${row.subscription.user.last_name}`,
    },
    {
      header: 'Date d\'émission',
      accessorKey: 'issue_date',
      cell: (row: Invoice) => formatDate(row.issue_date),
    },
    {
      header: 'Date d\'échéance',
      accessorKey: 'due_date',
      cell: (row: Invoice) => formatDate(row.due_date),
    },
    {
      header: 'Montant',
      accessorKey: 'amount',
      cell: (row: Invoice) => {
        const amount = typeof row.amount === 'string' ? parseFloat(row.amount) : row.amount;
        return `${amount.toFixed(2)} €`;
      },
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: (row: Invoice) => {
        const status = statusMap[row.status]
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        )
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: Invoice) => (
        <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedInvoice(row)
            setDialogOpen(true)
          }}
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedInvoice(row)
            setDeleteDialogOpen(true)
          }}
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
      ),
    }
  ]
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Rechercher une facture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedInvoice(undefined)
            setDialogOpen(true)
          }}
          className="bg-[#01631b] hover:bg-[#01631b]/90"
        >
          <IconPlus className="mr-2 h-4 w-4" />
          Nouvelle facture
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : paginatedInvoices ? (
        <PaginatedDataTable
          data={paginatedInvoices.data}
          columns={columns}
          searchable={true}
          searchKeys={[
            'invoice_number',
            'amount',
            'status',
            'issue_date',
            'due_date'
          ]}
        />
      ) : (
        <div className="text-center py-4 text-red-500">
          Erreur lors du chargement des données
        </div>
      )}

      <InvoiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        invoice={selectedInvoice}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer la facture"
        description="Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible."
        onConfirm={() => {
          if (selectedInvoice) {
            deleteMutation.mutate(selectedInvoice.id)
          }
        }}
      />
    </div>
  )
} 