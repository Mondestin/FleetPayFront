import { useState, useEffect } from 'react'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { paymentReportService } from '../data/payment-report-service'
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
import { IconSearch, IconDownload, IconDotsVertical } from '@tabler/icons-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { WeekPicker } from '@/components/ui/week-picker'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from '@/components/ui/status-badge'
import { utils, writeFile } from 'xlsx'
import { format, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import { api } from '@/lib/api'

export function PaymentReportsList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const weekStart = format(startOfWeek(selectedDate, { locale: fr }), 'yyyy-MM-dd')
  const [commission, setCommission] = useState(50)

  const { data: paginatedReports, isLoading } = useQuery({
    queryKey: ['payment-reports', currentPage, search, weekStart],
    queryFn: () => paymentReportService.getAll(currentPage, weekStart, search),
    placeholderData: keepPreviousData
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    setCurrentPage(1)
  }, [weekStart])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    api.get('/api/settings/commission').then(response => {
      setCommission(Number(response.data.value))
    })
  }, [])

  const handleStatusChange = async (id: string, newStatus: 'paid' | 'pending') => {
    try {
      await paymentReportService.update(id, { status: newStatus })
      queryClient.invalidateQueries({ queryKey: ['payment-reports'] })
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleExportToExcel = () => {
    if (!paginatedReports?.data) return
    
    const dataToExport = paginatedReports.data.map(report => ({
      'Chauffeur': `${report.driver.first_name} ${report.driver.last_name}`,
      'Bolt': Number(report.bolt_earnings).toFixed(2),
      'Uber': Number(report.uber_earnings).toFixed(2),
      'Heetch': Number(report.heetch_earnings).toFixed(2),
      'Total revenus': report.total_earnings.toFixed(2),
      'Commission': commission.toFixed(2),
      'Montant dû': (report.total_earnings - commission).toFixed(2),
      'Statut': report.status === 'paid' ? 'Payé' : 'En attente'
    }))
    
    const ws = utils.json_to_sheet(dataToExport)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Rapports')
    
    writeFile(wb, `rapports-paiements-${format(startOfWeek(selectedDate, { locale: fr }), 'yyyy-MM-dd')}.xlsx`)
  }

  return (
    <div className="space-y-4 p-4">
      <div className='flex items-center justify-between gap-4'>
        <div className='relative max-w-sm flex-1'>
          <IconSearch className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Rechercher un chauffeur...'
            className='pl-8'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <WeekPicker 
            date={selectedDate} 
            onDateChange={setSelectedDate}
          />
          <Button 
            onClick={handleExportToExcel} 
            disabled={!paginatedReports?.data}
            className="bg-[#01631b] hover:bg-[#01631b]/90"
          >
            <IconDownload className="mr-2 h-4 w-4" />
            Exporter le rapport
          </Button>
        </div>
      </div>

      {!isLoading && paginatedReports ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chauffeur</TableHead>
                <TableHead>Bolt</TableHead>
                <TableHead>Uber</TableHead>
                <TableHead>Heetch</TableHead>
                <TableHead>Total revenus</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Montant dû</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Gérer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.data.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className='font-medium'>
                    {report.driver.first_name} {report.driver.last_name}
                  </TableCell>
                  <TableCell>€{Number(report.bolt_earnings).toFixed(2)}</TableCell>
                  <TableCell>€{Number(report.uber_earnings).toFixed(2)}</TableCell>
                  <TableCell>€{Number(report.heetch_earnings).toFixed(2)}</TableCell>
                  <TableCell>€{report.total_earnings.toFixed(2)}</TableCell>
                  <TableCell className="text-red-500">-€{commission.toFixed(2)}</TableCell>
                  <TableCell className='font-medium'>
                    €{(report.total_earnings - commission).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={report.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <IconDotsVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(
                            report.id, 
                            report.status === 'paid' ? 'pending' : 'paid'
                          )}
                        >
                          Marquer comme {report.status === 'paid' ? 'en attente' : 'payé'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginatedReports.total > 0 ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    disabled={paginatedReports.current_page === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.ceil(paginatedReports.total / paginatedReports.per_page) }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={paginatedReports.current_page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    disabled={paginatedReports.current_page >= Math.ceil(paginatedReports.total / paginatedReports.per_page)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Aucun rapport trouvé
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