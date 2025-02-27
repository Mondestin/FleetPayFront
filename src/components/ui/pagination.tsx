import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-end", className)}
    {...props}
  />
)

const PaginationContent = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />
)

const PaginationItem = ({ className, ...props }: React.ComponentProps<"li">) => (
  <li className={cn("", className)} {...props} />
)

type PaginationButtonProps = {
  isActive?: boolean
} & ButtonProps

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationButtonProps) => (
  <Button
    variant={isActive ? "outline" : "ghost"}
    className={cn("", className)}
    {...props}
  />
)

const PaginationPrevious = ({ className, ...props }: ButtonProps) => (
  <Button
    variant="ghost"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    Précédent
  </Button>
)

const PaginationNext = ({ className, ...props }: ButtonProps) => (
  <Button
    variant="ghost"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    Suivant
  </Button>
)

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} 