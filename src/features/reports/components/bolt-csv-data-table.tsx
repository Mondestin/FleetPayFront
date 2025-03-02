import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface BoltDriverData {
  'Driver': string
  'Driver\'s Phone': string
  'Email': string
  'Projected payout|€': string
}

export function BoltCsvDataTable({ data, headers }: { data: BoltDriverData[], headers: string[] }) {
  if (data.length === 0) return null

  return (
    <div className='rounded-lg border'>
      <div className='p-4'>
        <h3 className='text-lg font-semibold'>Données Bolt importées</h3>
        <p className='text-sm text-muted-foreground'>
          Affichage de {data.length} lignes
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell key={`${index}-${header}`}>
                  {row[header as keyof BoltDriverData]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 