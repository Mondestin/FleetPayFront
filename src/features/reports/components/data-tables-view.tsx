import { CsvDataTable } from './csv-data-table'
import { BoltCsvDataTable } from './bolt-csv-data-table'
import { PdfDataTable } from './pdf-data-table'
import { type DriverData, type BoltDriverData, type HeetchData } from '../types'

interface DataTablesViewProps {
  csvData: DriverData[]
  boltCsvData: BoltDriverData[]
  pdfData: HeetchData[]
  isLoading: boolean
  pdfFile: File | null
}

export function DataTablesView({ csvData, boltCsvData, pdfData, isLoading, pdfFile }: DataTablesViewProps) {
  return (
    <>
      {csvData.length > 0 && (
        <CsvDataTable 
          data={csvData} 
          headers={[
            'Prénom du chauffeur',
            'Nom du chauffeur',
            'Revenus totaux',
            'Versements',
            'Remboursements et notes de frais',
            'Revenus totaux:Bonus',
            'Revenus totaux:Autres revenus:Ajustement des frais de service liés aux courses partagées',
            'Revenus totaux:Autres revenus:Retour d\'un objet oublié',
            'Montant versé à des tiers'
          ]} 
        />
      )}
      {boltCsvData.length > 0 && (
        <BoltCsvDataTable
          data={boltCsvData}
          headers={['Driver', 'Driver\'s Phone', 'Email', 'Projected payout|€']}
        />
      )}
      {(isLoading || pdfData.length > 0) && (
        <PdfDataTable
          data={pdfData}
          isLoading={isLoading}
          fileName={pdfFile?.name || ''}
        />
      )}
    </>
  )
} 