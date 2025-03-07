import * as pdfjsLib from 'pdfjs-dist'
import { api } from '@/lib/api'
export interface HeetchData {
  chauffeur: string;
  montant: string;
}

// Set up the worker using Vite's import.meta.url feature
const workerUrl = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;



export const handleHeetchPdfUpload = async (file: File, weekDate: Date) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    const extractedData = extractTableData(fullText);
    const formattedData = extractedData.map(row => ({

      firstName: row['chauffeur'].split(' ')[0],
      lastName: row['chauffeur'].split(' ')[1] + ' ' + (
        row['chauffeur'].split(' ')[2] || ''
      ),
      phoneNumber: '',
      fullName: row['chauffeur'],
      email: '',
      totalRevenue: (row['montant'].split(' ')[0]).replace(',', '.'),
      platform: 'heetch',
      weekDate
    }))
      try {
        await api.post('/api/reports/platforms/import/heetch', {
          weekDate,
          data: formattedData
        })
      } catch (error) {
        console.error('Error processing Heetch data')
      }
    return extractedData;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}

export const extractTableData = (text: string): HeetchData[] => {
  const rows: HeetchData[] = [];
  const lines = text.split('\n');
  
  for (let line of lines) {
    const match = line.match(/Chauffeur\s+(.*?)\s+Montant du virement/);
    const montantMatch = line.match(/(\d+,\d{2}\s*€)/);
    
    if (match && montantMatch) {
      const chauffeur = match[1].trim();
      const montant = montantMatch[0].trim();
      if (chauffeur) {
        rows.push({ chauffeur, montant });
      }
    }
  }
  return rows;
} 