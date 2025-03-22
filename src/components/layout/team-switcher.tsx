import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useUser } from '@/features/auth/hooks/use-user'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function TeamSwitcher() {
  const { user } = useUser()
  const { data: company } = useQuery({
    queryKey: ['company', user?.id],
    queryFn: () => api.get(`/api/companies/${user?.id}`).then(res => res.data)
  })

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground'>
                {company?.logo ? (
                  <img src={company.logo} alt={company.name} className='size-8 object-contain' />
                ) : (
                  <div className='size-8 flex items-center justify-center bg-primary text-primary-foreground rounded-lg'>
                    {company?.name?.[0] || 'C'}
                  </div>
                )}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {company?.name || 'Chargement...'}
                </span>
                <span className='truncate text-xs'>{user?.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
