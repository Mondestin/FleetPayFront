import { DataTable } from './data-table'
import { Skeleton } from './skeleton'
import { Input } from './input'
import { useState } from 'react'

interface PaginatedDataTableProps<T> {
  data: T[]
  columns: any[]
  isLoading?: boolean
  actions?: (item: T) => React.ReactNode
  searchPlaceholder?: string
  enableSearch?: boolean
}

export function PaginatedDataTable<T>({
  data,
  columns,
  isLoading,
  actions,
  searchPlaceholder = 'Search...',
  enableSearch = false
}: PaginatedDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = enableSearch
    ? data.filter((item) =>
        Object.values(item as any).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {enableSearch && (
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      )}
      <DataTable data={filteredData} columns={columns} actions={actions} />
    </div>
  )
} 