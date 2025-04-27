import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DriverData {
  'Prénom du chauffeur': string
  'Nom du chauffeur': string
  'Revenus totaux': string,
  'Versements': string,
  'Remboursements et notes de frais': string,
  'Revenus totaux:Bonus': string,
  'Revenus totaux:Autres revenus:Ajustement des frais de service liés aux courses partagées': string,
  'Revenus totaux:Autres revenus:Retour d\'un objet oublié': string,
  'Montant versé à des tiers': string
}

export function CsvDataTable({ data, headers }: { data: DriverData[], headers: string[] }) {
  if (data.length === 0) return null

  return (
    <div className='rounded-lg border'>
      <div className='p-4'>
        <h3 className='text-lg font-semibold'>Données importées</h3>
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
                    {row[header as keyof DriverData]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 