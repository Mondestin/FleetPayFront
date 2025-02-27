import { type HeetchData } from '../lib/pdf-utils'

export function PdfDataTable({ 
  data, 
  fileName 
}: { 
  data: HeetchData[], 
  isLoading: boolean, 
  fileName: string 
}) {
  if (data.length === 0 && fileName) {
    return (
      <div className="mt-8 text-center text-gray-600">
        <span className="ml-2">
          Les données en pdf ne peuvent pas être affichées, veuillez valider l'import pour les voir
        </span>
      </div>
    )
  }

} 