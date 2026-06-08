import { format, startOfWeek, endOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IconTrash } from '@tabler/icons-react'

interface UploadStatus {
  platform: 'bolt' | 'uber' | 'heetch'
  uploaded: boolean
  validated: boolean
}

interface Props {
  uploadStatus: UploadStatus[]
  onDeleteUpload: (platform: UploadStatus['platform']) => void
  weekStart?: Date
}

const PLATFORMS = [
  { id: 'bolt' as const, label: 'Bolt', format: 'CSV' },
  { id: 'uber' as const, label: 'Uber', format: 'CSV' },
  { id: 'heetch' as const, label: 'Heetch', format: 'PDF ou CSV' },
]

export function UploadStatusTable({ uploadStatus, onDeleteUpload, weekStart }: Props) {
  const startDate = weekStart
    ? startOfWeek(weekStart, { locale: fr })
    : startOfWeek(new Date(), { locale: fr })
  const weekEnd = weekStart
    ? endOfWeek(weekStart, { locale: fr })
    : endOfWeek(new Date(), { locale: fr })

  const getStatus = (platformId: string) =>
    uploadStatus.find(s => s.platform === platformId)

  const uploadedCount = PLATFORMS.filter(p => getStatus(p.id)?.uploaded).length

  return (
    <div className='rounded-xl border bg-background shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='px-5 py-4 border-b'>
        <div className='flex items-start justify-between'>
          <div>
            <h3 className='font-semibold text-base'>État des imports de la semaine</h3>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {format(startDate, 'dd MMM', { locale: fr })}
              {' – '}
              {format(weekEnd, 'dd MMM yyyy', { locale: fr })}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold'>
              {uploadedCount}
              <span className='text-muted-foreground font-normal text-base'>/{PLATFORMS.length}</span>
            </p>
            <p className='text-xs text-muted-foreground'>importés</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className='mt-3 h-1.5 rounded-full bg-muted overflow-hidden'>
          <div
            className='h-full rounded-full bg-[#01631b] transition-all duration-500'
            style={{ width: `${(uploadedCount / PLATFORMS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Platform rows */}
      <div className='divide-y'>
        {PLATFORMS.map((platform) => {
          const status = getStatus(platform.id)
          const isUploaded = status?.uploaded ?? false

          return (
            <div
              key={platform.id}
              className='flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors'
            >
              {/* Info */}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium'>{platform.label}</p>
                <p className='text-xs text-muted-foreground'>{platform.format}</p>
              </div>

              {/* Status badge */}
              {isUploaded ? (
                <span className='inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full shrink-0'>
                  Importé
                </span>
              ) : (
                <span className='inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2.5 py-1 rounded-full shrink-0'>
                  En attente
                </span>
              )}

              {/* Delete */}
              {isUploaded && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                    >
                      <IconTrash size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Supprimer l'importation {platform.label}</DialogTitle>
                      <DialogDescription>
                        Cette action supprimera définitivement l'import {platform.label} de cette semaine.
                        Elle est irréversible.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant='destructive' onClick={() => onDeleteUpload(platform.id)}>
                        Supprimer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
