import { useState, useEffect, useMemo } from 'react'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { paymentReportService } from '../data/payment-report-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSearch, IconDownload, IconDotsVertical, IconCash } from '@tabler/icons-react'
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
import { PaginatedDataTable } from '@/features/shared/components/PaginatedDataTable'
import { type PaymentReport } from '../data/schema'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"


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

  const columns = [
    {
      header: '#',
      accessorKey: 'id' as keyof PaymentReport,
      cell: (row: PaymentReport) => (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {row.driver.first_name[0]}{row.driver.last_name[0]}
          </AvatarFallback>
        </Avatar>
      )
    },
    {
      header: 'Chauffeur' ,
      accessorKey: 'driver' as keyof PaymentReport,
      cell: (row: PaymentReport) => `${row.driver.first_name} ${row.driver.last_name}`
    },
    {
      header: 'Bolt',
      accessorKey: 'bolt_earnings',
      cell: (row: PaymentReport) => `€${Number(row.bolt_earnings).toFixed(2)}`
    },
    {
      header: 'Uber',
      accessorKey: 'uber_earnings',
      cell: (row: PaymentReport) => `€${Number(row.uber_earnings).toFixed(2)}`
    },
    {
      header: 'Heetch',
      accessorKey: 'heetch_earnings',
      cell: (row: PaymentReport) => `€${Number(row.heetch_earnings).toFixed(2)}`
    },
    {
      header: 'Total revenus',
      accessorKey: 'total_earnings',
      cell: (row: PaymentReport) => `€${row.total_earnings.toFixed(2)}`
    },
    {
      header: 'Commission',
      accessorKey: 'commission',
      cell: () => 
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1">
            <span>-€{commission.toFixed(2)}</span>
          </Badge>
        </div>
    },
    {
      header: 'Montant dû',
      accessorKey: 'total_due',
      cell: (row: PaymentReport) => {
        const amount = row.total_earnings - commission;
        const isNegative = amount < 0;
        
        return (
          <div className="flex items-center gap-2">
            <Badge variant={isNegative ? "destructive" : "success"} className="gap-1">
              <IconCash className="h-3 w-3" />
              <span>€{amount.toFixed(2)}</span>
            </Badge>
          </div>
        );
      }
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: (row: PaymentReport) => <StatusBadge status={row.status} />
    }
  ]

  const actions = (row: PaymentReport) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStatusChange(
            row.id,
            row.status === 'paid' ? 'pending' : 'paid'
          )}
        >
          Marquer comme {row.status === 'paid' ? 'en attente' : 'payé'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // Sort the data by driver's name
  const sortedData = useMemo(() => {
    if (!paginatedReports?.data) return []
    
    return [...paginatedReports.data].sort((a, b) => {
      const nameA = `${a.driver.first_name} ${a.driver.last_name}`.toLowerCase()
      const nameB = `${b.driver.first_name} ${b.driver.last_name}`.toLowerCase()
      return nameA.localeCompare(nameB)
    })
  }, [paginatedReports?.data])

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

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : paginatedReports ? (
        <PaginatedDataTable
          data={sortedData}
          columns={columns}
          actions={actions}
          searchable={true}
          searchKeys={['driver', 'status', 'total_earnings', 'total_due']}
          rowKeyField="id"
        />
      ) : (
        <div className="text-center py-4 text-red-500">
          Erreur lors du chargement des données
        </div>
      )}
    </div>
  )
} 