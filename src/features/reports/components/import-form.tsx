import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Papa from 'papaparse'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WeekPicker } from '@/components/ui/week-picker'
import { IconUpload, IconCheck } from '@tabler/icons-react'
import { handleHeetchPdfUpload, type HeetchData } from '../lib/pdf-utils'
import { CsvDataTable } from './csv-data-table'
import { PdfDataTable } from './pdf-data-table'
import { BoltCsvDataTable } from './bolt-csv-data-table'

interface DriverData {
  'Prénom du chauffeur': string
  'Nom du chauffeur': string
  'Revenus totaux : Prix net de la course': string
}

interface BoltDriverData {
  'Driver': string
  'Driver\'s Phone': string
  'Email': string
  'Projected payout|€': string
}

interface UploadStatus {
  platform: 'bolt' | 'uber' | 'heetch'
  uploaded: boolean
  validated: boolean
}

const formSchema = z.object({
  platform: z.string().min(1, 'Veuillez sélectionner une plateforme'),
  weekDate: z.date({
    required_error: "Veuillez sélectionner une semaine",
  }),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Veuillez sélectionner un fichier.',
    })
    .superRefine((files, ctx) => {
      const platform = (ctx.path as any)[0]
      if (platform === 'heetch') {
        if (files?.[0]?.type !== 'application/pdf') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Seuls les fichiers PDF sont acceptés pour Heetch.'
          })
        }
      } else {
        if (files?.[0]?.type !== 'text/csv') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Seuls les fichiers CSV sont acceptés pour cette plateforme.'
          })
        }
      }
    }),
})

type FormValues = z.infer<typeof formSchema>

export function ImportForm({ uploadStatus }: { uploadStatus: UploadStatus[] }) {
  const [csvData, setCsvData] = useState<DriverData[]>([])
  const [boltCsvData, setBoltCsvData] = useState<BoltDriverData[]>([])
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfData, setPdfData] = useState<HeetchData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: '',
      weekDate: new Date(),
    },
  })

  const selectedPlatform = form.watch('platform')

  const availablePlatforms = [
    { value: 'bolt', label: 'Bolt' },
    { value: 'uber', label: 'Uber' },
    { value: 'heetch', label: 'Heetch' },
  ].filter(platform => 
    !uploadStatus.find(status => 
      status.platform === platform.value && status.uploaded
    )
  )

  const handleValidateData = () => {
    queryClient.invalidateQueries({ queryKey: ['import-status'] })
    form.reset()
    setCsvData([])
    setBoltCsvData([])
    setPdfFile(null)
    toast({
      title: 'Données validées avec succès',
      variant: 'default',
    })
  }

  const handleBoltData = async (weekDate: Date, data: BoltDriverData[]) => {
    const formattedData = data.map(row => ({
      firstName: row['Driver'].split(' ')[0],
      lastName: row['Driver'].split(' ')[1] || '',
      phoneNumber: row['Driver\'s Phone'],
      email: row['Email'],
      totalRevenue: row['Projected payout|€'],
      platform: 'bolt',
      weekDate
    }))
    console.log("formattedData", formattedData)
    try {
      await api.post('/api/reports/platforms/import/bolt', {
        weekDate,
        data: formattedData
      })
    } catch (error) {
      console.error('Error processing Bolt data:', error)
      throw error
    }
  }

  const handleUberData = async (weekDate: Date, data: DriverData[]) => {
    const formattedData = data.map(row => ({
      firstName: row['Prénom du chauffeur'],
      lastName: row['Nom du chauffeur'],
      totalRevenue: row['Revenus totaux : Prix net de la course'],
      platform: 'uber',
      weekDate
    }))
    try {
      await api.post('/api/reports/platforms/import/uber', {
        weekDate,
        data: formattedData
      })
    } catch (error) {
      console.error('Error processing Uber data')
    }
  }

  const handlePlatformData = async (platform: string, weekDate: Date, data: DriverData[] | BoltDriverData[]) => {
    try {
      switch (platform) {
        case 'bolt':
          await handleBoltData(weekDate, data as BoltDriverData[])
          break
        case 'uber':
          await handleUberData(weekDate, data as DriverData[])
          break
        case 'heetch':
           await handleHeetchPdfUpload(pdfFile!, weekDate)
          break
        default:
          throw new Error('Platform not supported')
      }
      handleValidateData()
    } catch (error) {
      console.error('Error processing data:', error)
    }
  }

  function onSubmit(data: FormValues) {
    const file = data.file[0]

    if (data.platform === 'heetch') {
      setIsLoading(true)
      setPdfFile(file)
      
      handleHeetchPdfUpload(file, data.weekDate)
        .then((extractedData) => {
          setPdfData(extractedData)
          toast({
            title: 'PDF importé avec succès',
            description: `${extractedData.length} chauffeurs trouvés`,
            variant: 'default',
          })
        })
        .catch((error) => {
          console.error('Error processing PDF:', error)
          toast({
            title: 'Erreur lors de la lecture du PDF',
            variant: 'error',
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
      return
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Determine if this is Bolt or Uber data based on headers
        const isBoltData = results.meta.fields?.includes('Driver')
        
        if (isBoltData) {
          const parsedData = results.data as BoltDriverData[]
          setBoltCsvData(parsedData)
          setCsvData([]) // Clear other data
        } else {
          const parsedData = results.data as DriverData[]
          setCsvData(parsedData)
          setBoltCsvData([]) // Clear other data
        }

        toast({
          title: 'Import réussi',
          description: `${results.data.length} lignes chargées de ${file.name}`,
          variant: 'default',
        })
      },
      error: (error) => {
        toast({
          title: 'Erreur de lecture CSV',
          description: error.message,
          variant: 'error',
        })
      },
    })
  }

  return (
    <div className='rounded-lg border shadow-sm bg-background p-4'>
      <h3 className='mb-4 text-lg font-semibold'>Importer un fichier</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="weekDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semaine</FormLabel>
                <FormControl>
                  <WeekPicker date={field.value} onDateChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plateforme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une plateforme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availablePlatforms.map(platform => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

         

          {selectedPlatform && (
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange } }) => (
                <FormItem>
                  {selectedPlatform === 'heetch' ? (
                    <>
                      <FormLabel>Fichier PDF Heetch</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            onChange(e.target.files)
                            if (e.target.files?.[0]) {
                              setIsLoading(true)
                              setPdfFile(e.target.files[0])
              
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Sélectionnez le fichier PDF de paiement Heetch
                      </FormDescription>
                    </>
                  ) : (
                    <>
                      <FormLabel>Fichier CSV</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={(e) => onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormDescription>
                        Sélectionnez un fichier CSV à importer
                      </FormDescription>
                    </>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={!form.formState.isValid || csvData.length > 0 || (selectedPlatform === 'heetch' && pdfFile === null)}
            >
              <IconUpload className="mr-2 h-4 w-4" />
              Importer
            </Button>
            {(csvData.length > 0 || boltCsvData.length > 0 || pdfFile) && (
              <Button
                type="button"
                onClick={() => handlePlatformData(
                  form.getValues('platform'),
                  form.getValues('weekDate'),
                  form.getValues('platform') === 'bolt' ? boltCsvData : csvData
                )}
                className="bg-[#01631b] hover:bg-[#01631b]/90"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                Valider l'import
              </Button>
            )}
          </div>
        </form>
      </Form>

      {csvData.length > 0 && (
        <CsvDataTable 
          data={csvData} 
          headers={[
            'Prénom du chauffeur',
            'Nom du chauffeur',
            'Revenus totaux : Prix net de la course'
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
    </div>
  )
} 