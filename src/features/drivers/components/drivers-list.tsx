import { useState, useEffect } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { driverService } from '../data/driver-service'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import { IconSearch } from '@tabler/icons-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { StatusBadge } from '@/components/ui/status-badge'


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
        <div className="text-center py-8">Chargement...</div>
      ) : paginatedDrivers ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDrivers.data.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">
                    {driver.first_name} {driver.last_name}
                  </TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.phone_number}</TableCell>
                  <TableCell>
                    <StatusBadge status={driver.status} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(driver.created_at), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginatedDrivers.total > 0 ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!paginatedDrivers.prev_page_url}
                  />
                </PaginationItem>
                
                {paginatedDrivers.links.map((link, i) => (
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
                    disabled={!paginatedDrivers.next_page_url}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Aucun chauffeur trouvé
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4 text-red-500">
          Erreur lors du chargement des données
        </div>
      )}
    </div>
  )
} 