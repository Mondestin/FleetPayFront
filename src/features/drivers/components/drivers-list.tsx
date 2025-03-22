import { useState } from 'react'
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { driverService } from '../data/driver-service'
import { Input } from '@/components/ui/input'
import { IconSearch, IconDownload, IconTrash } from '@tabler/icons-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { StatusBadge } from '@/components/ui/status-badge'
import { PaginatedDataTable } from '@/features/shared/components/PaginatedDataTable'
import { type Driver } from '../data/schema'
import { type Column } from '@/features/shared/components/DataTable'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function DriversList() {
  const [search, setSearch] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const queryClient = useQueryClient()

  const { data: paginatedDrivers, isLoading } = useQuery({
    queryKey: ['drivers', search],
    queryFn: () => driverService.getAll(search),
    placeholderData: keepPreviousData
  })

  // Add delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => driverService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      toast.success('Chauffeur supprimé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  const handleDelete = (driver: Driver) => {
    setSelectedDriver(driver)
    setDeleteDialogOpen(true)
  }

  const columns: Column<Driver>[] = [
    {
      header: '#',
      accessorKey: 'first_name' as keyof Driver,
      cell: (row: Driver) => (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {row.first_name[0]}{row.last_name[0]}
          </AvatarFallback>
        </Avatar>
      )
    },
    {
      header: 'Nom',
      accessorKey: 'last_name' as keyof Driver,
      cell: (row: Driver) => `${row.first_name} ${row.last_name}`
    },
    {
      header: 'Email',
      accessorKey: 'email' as keyof Driver,
      cell: (row: Driver) => row.email ? row.email : ''
    },
    {
      header: 'Téléphone',
      accessorKey: 'phone_number' as keyof Driver,
      cell: (row: Driver) => row.phone_number ? row.phone_number : ''
    },
    {
      header: 'Statut',
      accessorKey: 'status' as keyof Driver,
      cell: (row: Driver) => <StatusBadge status={row.status} />
    },
    {
      header: "Date d'inscription",
      accessorKey: 'created_at' as keyof Driver,
      cell: (row: Driver) => format(new Date(row.created_at), 'dd MMM yyyy', { locale: fr })
    },
    {
      header: 'Actions',
      accessorKey: 'id' as keyof Driver,
      cell: (row: Driver) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(row)}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      )
    }
  ]

  // Add export function
  const exportToExcel = (drivers: any[]) => {
    try {
      const formattedData = drivers.map(driver => ({
        'Prénom': driver.first_name,
        'Nom': driver.last_name,
        'Email': driver.email,
        'Téléphone': driver.phone_number,
        'Statut': driver.status,
        'Date de création': new Date(driver.created_at).toLocaleDateString('fr-FR')
      }))

      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Chauffeurs')
      
      // Generate file name with current date
      const fileName = `chauffeurs_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)

      toast.success('Export réussi', {
        description: 'Le fichier a été téléchargé avec succès'
      })
    } catch (error) {
      toast.error('Erreur lors de l\'export', {
        description: 'Une erreur est survenue lors de l\'export des données'
      })
    }
  }

  return (
    <>
      <div className="space-y-4 p-4">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un chauffeur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button
              onClick={() => exportToExcel(paginatedDrivers?.data || [])}
              variant="outline"
              className="flex items-center gap-2 bg-[#01631b] hover:bg-[#01631b]/90"
          >
              <IconDownload className="h-4 w-4 text-white" />
              <span className="text-white">Exporter ce tableau</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : paginatedDrivers ? (
          <PaginatedDataTable
            data={paginatedDrivers.data}
            columns={columns}
            searchable={true}
            searchKeys={['first_name', 'last_name', 'email']}
          />
        ) : (
          <div className="text-center py-4 text-red-500">
            Erreur lors du chargement des données
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le chauffeur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer {selectedDriver?.first_name} {selectedDriver?.last_name} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedDriver) {
                  deleteMutation.mutate(selectedDriver.id)
                  setDeleteDialogOpen(false)
                }
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 