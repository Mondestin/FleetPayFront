import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow',
        destructive:
          'border-transparent bg-destructive/15 text-destructive hover:bg-destructive/25 shadow',
        success:
          'border-transparent bg-green-100 text-green-700 hover:bg-green-200 shadow',
        warning:
          'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200 shadow',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
