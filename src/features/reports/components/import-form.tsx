import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Papa from 'papaparse'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WeekPicker } from '@/components/ui/week-picker'
import { handleHeetchPdfUpload } from '../lib/pdf-utils'
import { useUser } from '@/features/auth/hooks/use-user'
import { DataTablesView } from '../components/data-tables-view'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'
import { UberDriverData, BoltDriverData, HeetchData, HeetchCsvData } from '../types'
import { cn } from '@/lib/utils'

interface UploadStatus {
  platform: 'bolt' | 'uber' | 'heetch'
  uploaded: boolean
  validated: boolean
}

const formSchema = z.object({
  platform: z.string().min(1, 'Veuillez sélectionner une plateforme'),
  weekDate: z.date({
    required_error: 'Veuillez sélectionner une semaine',
  }),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Veuillez sélectionner un fichier.',
    })
    .superRefine((files, ctx) => {
      const file = files?.[0]
      if (!file) return
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf')
      const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv')
      if (!isPdf && !isCsv) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Seuls les fichiers PDF ou CSV sont acceptés.',
        })
      }
    }),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  uploadStatus: UploadStatus[]
  selectedWeek: Date
  onWeekChange: (date: Date) => void
}

const PLATFORM_CONFIG = {
  bolt: { label: 'Bolt', accept: 'Accepte CSV uniquement' },
  uber: { label: 'Uber', accept: 'Accepte CSV uniquement' },
  heetch: { label: 'Heetch', accept: 'Accepte PDF ou CSV' },
} as const

export function ImportForm({ uploadStatus, selectedWeek, onWeekChange }: Props) {
  const [csvData, setCsvData] = useState<UberDriverData[]>([])
  const [boltCsvData, setBoltCsvData] = useState<BoltDriverData[]>([])
  const [heetchCsvData, setHeetchCsvData] = useState<HeetchCsvData[]>([])
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfData, setPdfData] = useState<HeetchData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const queryClient = useQueryClient()
  const { user } = useUser()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: '',
      weekDate: selectedWeek,
    },
  })

  useEffect(() => {
    form.setValue('weekDate', selectedWeek)
  }, [selectedWeek, form])

  const selectedPlatform = form.watch('platform') as keyof typeof PLATFORM_CONFIG | ''

  // Clear file when platform changes
  useEffect(() => {
    clearFile()
  }, [selectedPlatform])

  const availablePlatforms = (
    Object.entries(PLATFORM_CONFIG) as [keyof typeof PLATFORM_CONFIG, (typeof PLATFORM_CONFIG)[keyof typeof PLATFORM_CONFIG]][]
  ).filter(([value]) =>
    !uploadStatus.find(s => s.platform === value && s.uploaded)
  )

  const clearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
    form.resetField('file')
    setSelectedFileName(null)
    setPdfFile(null)
    setPdfData([])
    setHeetchCsvData([])
    setCsvData([])
    setBoltCsvData([])
  }

  const handleFileChange = (files: FileList | null, onChange: (v: FileList | null) => void) => {
    if (!files || files.length === 0) return
    onChange(files)
    setSelectedFileName(files[0].name)
  }

  const handleValidateData = () => {
    queryClient.invalidateQueries({ queryKey: ['import-status'] })
    form.reset()
    clearFile()
    toast({ title: 'Données validées avec succès', variant: 'success' })
  }

  const handleBoltData = async (weekDate: Date, data: BoltDriverData[]) => {
    const formattedData = data.filter(row => row['Driver'] != null).map((row) => ({
      firstName: row['Driver'].split(' ')[0],
      lastName: (row['Driver'].split(' ')[1] || '') + ' ' + (row['Driver'].split(' ')[2] || '') + ' ' + (row['Driver'].split(' ')[3] || ''),
      phoneNumber: row["Driver's Phone"],
      email: row['Email'],
      fullName: row['Driver'],
      totalRevenue: row['Projected payout|€'],
      platform: 'bolt',
      weekDate,
      user: user?.id,
    }))
    await api.post('/api/reports/platforms/import/bolt', { weekDate, data: formattedData })
  }

  const handleUberData = async (weekDate: Date, data: UberDriverData[]) => {
    const formattedData = data.map(row => ({
      firstName: row['Prénom du chauffeur'],
      lastName: row['Nom du chauffeur'],
      totalRevenue: (Number(row['Revenus totaux']) || 0) - (Number(row['Espèces collectées']) || 0),
      phoneNumber: row['Numéro de téléphone du chauffeur'],
      email: row['Adresse e-mail du chauffeur'],
      fullName: row['Prénom du chauffeur'] + ' ' + row['Nom du chauffeur'],
      platform: 'uber',
      weekDate,
      user: user?.id,
    }))
    await api.post('/api/reports/platforms/import/uber', { weekDate, data: formattedData })
  }

  const handleHeetchCsvData = async (weekDate: Date, data: HeetchCsvData[]) => {
    const filtered = data.filter(row => row['Chauffeur'] && row['Chauffeur'].toUpperCase() !== 'TOTAL')
    const formattedData = filtered.map(row => ({
      firstName: row['Chauffeur'].trim().split(' ')[0],
      lastName: row['Chauffeur'].trim().split(' ').slice(1).join(' ').trim(),
      phoneNumber: '',
      fullName: row['Chauffeur'].trim(),
      email: '',
      totalRevenue: String(Math.abs(parseFloat((row['Versement flotte'] || '0').replace(',', '.')))),
      platform: 'heetch',
      weekDate,
      user: user?.id,
    }))
    await api.post('/api/reports/platforms/import/heetch', { weekDate, data: formattedData })
  }

  const handlePlatformData = async (platform: string, weekDate: Date, data: UberDriverData[] | BoltDriverData[]) => {
    setIsSubmitting(true)
    try {
      switch (platform) {
        case 'bolt':
          await handleBoltData(weekDate, data as BoltDriverData[])
          break
        case 'uber':
          await handleUberData(weekDate, data as UberDriverData[])
          break
        case 'heetch':
          if (heetchCsvData.length > 0) {
            await handleHeetchCsvData(weekDate, heetchCsvData)
          } else {
            await handleHeetchPdfUpload(pdfFile!, weekDate, user?.id)
          }
          break
        default:
          throw new Error('Platform not supported')
      }
      handleValidateData()
    } catch {
      toast({ title: "Erreur lors de l'envoi des données", variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  function onSubmit(data: FormValues) {
    const file = data.file[0]

    if (data.platform === 'heetch') {
      setPdfFile(file)
      if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
        setIsLoading(true)
        handleHeetchPdfUpload(file, data.weekDate, user?.id)
          .then((extractedData) => {
            setPdfData(extractedData)
            toast({ title: 'PDF importé avec succès', description: `${extractedData.length} chauffeurs trouvés`, variant: 'success' })
          })
          .catch(() => toast({ title: 'Erreur lors de la lecture du PDF', variant: 'error' }))
          .finally(() => setIsLoading(false))
      } else {
        Papa.parse(file, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          transformHeader: (header: string) => header.replace(/^﻿/, ''),
          complete: (results) => {
            const rows = results.data as HeetchCsvData[]
            const filtered = rows.filter(row => row['Chauffeur'] && row['Chauffeur'].toUpperCase() !== 'TOTAL')
            setHeetchCsvData(filtered)
            setPdfData(filtered.map(row => ({ chauffeur: row['Chauffeur'], montant: row['Versement flotte'] })))
            toast({ title: 'CSV importé avec succès', description: `${filtered.length} chauffeurs trouvés`, variant: 'success' })
          },
          error: (error: Error) => toast({ title: 'Erreur de lecture CSV', description: error.message, variant: 'error' }),
        })
      }
      return
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const isBoltData = results.meta.fields?.includes('Driver')
        if (isBoltData) {
          setBoltCsvData(results.data as BoltDriverData[])
          setCsvData([])
        } else {
          setCsvData(results.data as UberDriverData[])
          setBoltCsvData([])
        }
        toast({ title: 'Import réussi', description: `${results.data.length} lignes chargées`, variant: 'success' })
      },
      error: (error) => toast({ title: 'Erreur de lecture CSV', description: error.message, variant: 'error' }),
    })
  }

  const hasPreviewData = csvData.length > 0 || boltCsvData.length > 0 || pdfFile
  const platformConfig = selectedPlatform ? PLATFORM_CONFIG[selectedPlatform] : null

  return (
    <>
      <div className='rounded-xl border bg-background shadow-sm overflow-hidden'>
        {/* Card header */}
        <div className='px-5 py-4 border-b bg-muted/30'>
          <h3 className='font-semibold text-base'>Importer un fichier</h3>
          <p className='text-xs text-muted-foreground mt-0.5'>Sélectionnez une plateforme et importez votre rapport</p>
        </div>

        {/* Form body */}
        <div className='p-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              {/* Week + Platform on same row */}
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='weekDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>Semaine</FormLabel>
                      <FormControl>
                        <WeekPicker
                          date={field.value}
                          onDateChange={(date) => {
                            field.onChange(date)
                            onWeekChange(date)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='platform'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>Plateforme</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Sélectionnez une plateforme' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availablePlatforms.map(([value, config]) => (
                            <SelectItem key={value} value={value}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dropzone */}
              {selectedPlatform && (
                <FormField
                  control={form.control}
                  name='file'
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Fichier {platformConfig?.label}
                      </FormLabel>
                      <FormControl>
                        <div>
                          {/* Hidden native input */}
                          <input
                            ref={fileInputRef}
                            type='file'
                            accept={selectedPlatform === 'heetch' ? '.pdf,.csv' : '.csv'}
                            className='hidden'
                            onChange={(e) => handleFileChange(e.target.files, onChange)}
                          />

                          {selectedFileName ? (
                            /* Selected file preview */
                            <div className='flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3'>
                              <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium truncate'>{selectedFileName}</p>
                                <p className='text-xs text-muted-foreground'>Prêt à importer</p>
                              </div>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='shrink-0 text-xs text-muted-foreground hover:text-foreground'
                                onClick={clearFile}
                              >
                                Retirer
                              </Button>
                            </div>
                          ) : (
                            /* Dropzone */
                            <div
                              className={cn(
                                'rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all cursor-pointer select-none',
                                isDragging
                                  ? 'border-[#01631b] bg-[#01631b]/5 scale-[1.01]'
                                  : 'border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-muted/20'
                              )}
                              onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                              onDrop={(e) => {
                                e.preventDefault()
                                setIsDragging(false)
                                handleFileChange(e.dataTransfer.files, onChange)
                              }}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <p className='text-sm font-medium'>
                                {isDragging ? 'Déposez le fichier ici' : 'Glissez votre fichier ici'}
                              </p>
                              <p className='mt-1 text-xs text-muted-foreground'>
                                ou <span className='text-[#01631b] font-medium'>cliquez pour parcourir</span>
                              </p>
                              <p className='mt-3 text-xs text-muted-foreground/60'>
                                {platformConfig?.accept}
                              </p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Actions */}
              <div className='flex items-center justify-end gap-2 pt-1'>
                <Button
                  type='submit'
                  variant='outline'
                  disabled={!form.formState.isValid || csvData.length > 0}
                >
                  Importer
                </Button>

                {hasPreviewData && (
                  <Button
                    type='button'
                    onClick={() => handlePlatformData(
                      form.getValues('platform'),
                      form.getValues('weekDate'),
                      form.getValues('platform') === 'bolt' ? boltCsvData : csvData
                    )}
                    className='bg-[#01631b] hover:bg-[#01631b]/90'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className='mr-2 h-4 w-4' />
                        Validation…
                      </>
                    ) : (
                      "Valider l'import"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Data preview below the 2-col layout */}
      <DataTablesView
        csvData={csvData}
        boltCsvData={boltCsvData}
        pdfData={pdfData}
        isLoading={isLoading}
        pdfFile={pdfFile}
      />
    </>
  )
}
