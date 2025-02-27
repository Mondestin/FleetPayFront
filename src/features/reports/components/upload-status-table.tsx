import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IconTrash } from '@tabler/icons-react'
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
import { StatusBadge } from '@/components/ui/status-badge'

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

export function UploadStatusTable({ uploadStatus, onDeleteUpload, weekStart }: Props) {
  const today = new Date()
  const startDate = weekStart ? startOfWeek(weekStart, { locale: fr }) : startOfWeek(new Date(), { locale: fr })
  const weekEnd = weekStart ? endOfWeek(weekStart, { locale: fr }) : endOfWeek(today, { locale: fr })

  return (
    <div className="rounded-lg border shadow-sm bg-background">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">État des imports de la semaine</h3>
        <p className="text-sm text-muted-foreground">
          {format(startDate, 'dd/MM/yyyy', { locale: fr })}
          {' - '}
          {format(weekEnd, 'dd/MM/yyyy', { locale: fr })}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead className="w-[180px]">Plateforme</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uploadStatus.map((platform, index) => (
            <TableRow key={platform.platform} className="hover:bg-muted/50">
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="capitalize">{platform.platform}</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge 
                  status={
                    platform.uploaded 
                      ? "imported" 
                      : platform.uploaded 
                      ? "imported" 
                      : "pending"
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {platform.uploaded && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <IconTrash size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Supprimer l'importation</DialogTitle>
                          <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer l'importation {platform.platform} ?
                            Cette action est irréversible.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              onDeleteUpload(platform.platform)
                              const closeButton = document.querySelector('[data-dialog-close]') as HTMLButtonElement
                              closeButton?.click()
                            }}
                          >
                            Supprimer
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 