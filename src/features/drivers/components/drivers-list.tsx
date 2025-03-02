import { useState, useEffect } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { driverService } from '../data/driver-service'
import { Input } from '@/components/ui/input'
import { IconSearch } from '@tabler/icons-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { StatusBadge } from '@/components/ui/status-badge'
import { PaginatedDataTable } from '@/features/shared/components/PaginatedDataTable'
import { type Driver } from '../data/schema'
import { type Column } from '@/features/shared/components/DataTable'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"

export function DriversList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  
  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Reset to first page on search
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: paginatedDrivers, isLoading } = useQuery({
    queryKey: ['drivers', currentPage, search],
    queryFn: () => driverService.getAll(currentPage, search),
    placeholderData: keepPreviousData
  })

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
      accessorKey: 'first_name',
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
    }
  ]

  return (
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
  )
} 