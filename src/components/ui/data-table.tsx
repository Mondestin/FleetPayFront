import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export function DataTable({ className, ...props }: React.ComponentProps<typeof Table>) {
  return (
    <div className="relative rounded-lg border shadow-sm dark:shadow-gray-800">
      <Table className={cn("", className)} {...props} />
    </div>
  )
}

export {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} 