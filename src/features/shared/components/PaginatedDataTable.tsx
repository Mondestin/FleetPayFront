import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronsLeftIcon, 
  ChevronsRightIcon,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
}

interface PaginatedDataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  actions?: (row: T) => React.ReactNode;
  searchable?: boolean;
  searchKeys?: Array<keyof T>;
  rowKeyField?: keyof T;
}

export function PaginatedDataTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  actions,
  rowKeyField = 'id' as keyof T
}: PaginatedDataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = data.slice(startIndex, endIndex);

  // Handle page changes
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (

      
       <>
        <div className="bg-white rounded-lg border-t-2 border-[#01631b]">
          <Table className='border rounded-lg border-separate border-spacing-0'>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={`${String(column.accessorKey)}-${index}`} className='rounded-lg'>{column.header}</TableHead>
                ))}
                {actions && <TableHead key="actions">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((row, index) => (
                  <TableRow 
                    key={String(row[rowKeyField])}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-muted/50'}
                  >
                    {columns.map((column) => (
                      <TableCell key={String(column.accessorKey)}>
                        {column.cell ? column.cell(row) : String(row[column.accessorKey])}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        {actions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow className='border-b'>
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-24 text-center border-b">
                    <p className="text-muted-foreground">Aucun résultat trouvé.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              
              Montrant  
              <span className="font-medium"> {startIndex + 1} </span> à{" "}
              <span className="font-medium">{endIndex}</span> sur{" "}
              <span className="font-medium">{totalItems}</span> résultats
            </p>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      
        </>
  );
}