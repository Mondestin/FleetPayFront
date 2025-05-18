import { useState } from 'react'
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from './data/user-service'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconPlus, IconSearch, IconEdit, IconTrash, IconCircleFilled } from '@tabler/icons-react'
import { toast } from 'sonner'
import { UserDialog } from './components/user-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from './types'
import { StatusBadge } from '@/components/ui/status-badge'
import { PaginatedDataTable } from '@/features/shared/components/PaginatedDataTable'
import { type Column } from '@/features/shared/components/DataTable'
import { Spinner } from '@/components/ui/spinner'
import { format, formatDistanceToNow, differenceInMinutes } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function Users() {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>()

  const { data: paginatedUsers, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => userService.getAll(search),
    placeholderData: keepPreviousData
  })

  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Utilisateur supprimé avec succès')
      setDeleteDialogOpen(false)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const columns: Column<User>[] = [
    {
      header: '#',
      accessorKey: 'full_name' as keyof User,
      cell: (row: User) => (
        <Avatar className="h-8 w-8">
          
          <AvatarFallback>
            {row.last_name[0]}{row.first_name[0]}
          </AvatarFallback>
        </Avatar>
      )
    },
    {
      header: 'Nom',
      accessorKey: 'last_name',
      cell: (row: User) => row.last_name
    },
    {
      header: 'Prénom',
      accessorKey: 'first_name',
      cell: (row: User) => row.first_name
    },
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Téléphone',
      accessorKey: 'phone_number',
      cell: (row: User) => row.phone_number ? row.phone_number : '-'
    },
   
    {
      header: 'Dernière connexion',
      accessorKey: 'last_used_at',
      cell: (row: User) => {
        if (!row.last_used_at) return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <IconCircleFilled className="h-3 w-3 text-red-500" />
              <span>Hors ligne</span>
            </div>
            <span className="text-xs text-muted-foreground">Jamais</span>
          </div>
        );
        
        const gmtDate = new Date(row.last_used_at + 'Z');
        const minutesDiff = differenceInMinutes(new Date(), gmtDate);
        
        if (minutesDiff <= 5) {
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <IconCircleFilled className="h-3 w-3 text-green-500" />
                <span>En ligne</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(gmtDate, { locale: fr, addSuffix: true , includeSeconds: true})}
              </span>
            </div>
          );
        }
        
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <IconCircleFilled className="h-3 w-3 text-red-500" />
              <span>Hors ligne</span>
            </div>
            <span className="text-xs text-muted-foreground">
             {formatDistanceToNow(gmtDate, { locale: fr, addSuffix: true })}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Rôle',
      accessorKey: 'role',
      cell: (row: User) => <StatusBadge status={row.role} />
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: (row: User) => <StatusBadge status={row.status} />
    },
    {
      header: "Inscription",
      accessorKey: 'created_at',
      cell: (row: User) => format(new Date(row.created_at), 'dd MMM yyyy', { locale: fr })
    }
  ]

  const actions = (row: User) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(row)}
      >
        <IconEdit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={() => handleDelete(row)}
      >
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold tracking-tight'>Gestion des utilisateurs</h2>
          <p className='text-muted-foreground'>
            Gérez les utilisateurs de la plateforme
          </p>
        </div>

        <div className='space-y-4 p-4 rounded-lg border shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='relative max-w-sm flex-1'>
              <IconSearch className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Rechercher un utilisateur...'
                className='pl-8'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
             <div className='flex justify-end ml-auto'> 
              <Button 
                className="bg-[#01631b] hover:bg-[#01631b]/90"
                onClick={() => {
                  setSelectedUser(undefined)
                  setDialogOpen(true)
                }}>
                <IconPlus className="mr-2 h-4 w-4" />
                Ajouter un utilisateur
                </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          ) : paginatedUsers ? (
            <PaginatedDataTable
              data={paginatedUsers.data}
              columns={columns}
              actions={actions}
              searchable={true}
              searchKeys={['first_name', 'last_name', 'email']}
            />
          ) : (
            <div className="text-center py-4 text-red-500">
              Erreur lors du chargement des données
            </div>
          )}
        </div>

        <UserDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          user={selectedUser}
        />

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Supprimer l'utilisateur"
          description={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${selectedUser?.first_name} ${selectedUser?.last_name} ?`}
          onConfirm={() => {
            if (selectedUser) {
              deleteMutation.mutate(selectedUser.id)
            }
          }}
        />
      </Main>
    </>
  )
}




