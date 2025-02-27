import { Button } from '@/components/ui/button'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns'
import { fr } from 'date-fns/locale'

interface WeekPickerProps {
  date: Date
  onDateChange: (date: Date) => void
}

export function WeekPicker({ date, onDateChange }: WeekPickerProps) {
  const weekStart = startOfWeek(date, { locale: fr })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  
  const handlePrevWeek = () => {
    onDateChange(subWeeks(date, 1))
  }

  const handleNextWeek = () => {
    onDateChange(addWeeks(date, 1))
  }

  return (
    <div className="w-50 max-w-md rounded-md border border shadow-sm bg-background">
      <div className="flex items-center justify-center">
        <Button variant="ghost" size="icon" className="mr-5 h-8 w-8" onClick={handlePrevWeek}>
          <IconChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">
          {format(days[0], 'MMM d')} - {format(days[6], 'MMM d')}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8 ml-5" onClick={handleNextWeek}>
          <IconChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}