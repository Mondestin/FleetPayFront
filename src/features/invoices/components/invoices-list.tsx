import { useState, useEffect } from 'react'
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invoiceService } from '../data/invoice-service'
import { type Invoice } from '../data/schema'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSearch, IconEdit, IconTrash, IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { InvoiceDialog } from './invoice-dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { StatusBadge } from '@/components/ui/status-badge'

export function InvoicesList() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>()

  const { data: paginatedInvoices, isLoading } = useQuery({
    queryKey: ['invoices', currentPage, search],
    queryFn: () => invoiceService.getAll(currentPage, search),
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const deleteMutation = useMutation({
    mutationFn: invoiceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Facture supprimée avec succès')
      setDeleteDialogOpen(false)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDialogOpen(true)
  }

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une facture..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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

      <div className="rounded-lg border shadow-sm">
        {!isLoading && paginatedInvoices ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date d'émission</TableHead>
                  <TableHead>Date d'échéance</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.data.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>
                      {invoice.user.first_name} {invoice.user.last_name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.issue_date), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.due_date), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>€{Number(invoice.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(invoice)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(invoice)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {paginatedInvoices.total > 0 ? (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={paginatedInvoices.current_page <= 1}
                    />
                  </PaginationItem>
                  
                  {paginatedInvoices.links.map((link, i) => (
                    <PaginationItem key={i}>
                      {link.url && (
                        <PaginationLink
                          onClick={() => {
                            if (link.url) {
                              const page = new URL(link.url).searchParams.get('page') || '1'
                              setCurrentPage(Number(page))
                            }
                          }}
                          isActive={link.active}
                        >
                          {link.label.replace('&laquo; ', '').replace(' &raquo;', '')}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={paginatedInvoices.current_page >= paginatedInvoices.last_page}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Aucune facture trouvée
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-red-500">
            Erreur lors du chargement des données
          </div>
        )}
      </div>

      <InvoiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        invoice={selectedInvoice}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer la facture"
        description="Êtes-vous sûr de vouloir supprimer cette facture ?"
        onConfirm={() => {
          if (selectedInvoice) {
            deleteMutation.mutate(selectedInvoice.id)
          }
        }}
      />
    </div>
  )
} 