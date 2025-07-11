import { CsvDataTable } from './csv-data-table'
import { BoltCsvDataTable } from './bolt-csv-data-table'
import { PdfDataTable } from './pdf-data-table'
import { type UberDriverData, type BoltDriverData, type HeetchData } from '../types'

interface DataTablesViewProps {
  csvData: UberDriverData[]
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
            'Numéro de téléphone du chauffeur',
            'Adresse e-mail du chauffeur',
            'Revenus totaux',
            'Espèces collectées'
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