import { useEffect, useState } from 'react'
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from './data/user-service'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconPlus, IconSearch, IconEdit, IconTrash } from '@tabler/icons-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from 'sonner'
import { UserDialog } from './components/user-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from './types'
import { StatusBadge } from '@/components/ui/status-badge'


export default function Users() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>()

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Reset to first page on search
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: paginatedUsers, isLoading } = useQuery({
    queryKey: ['users', currentPage, search],
    queryFn: () => userService.getAll(currentPage, search),
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

        <div className='mb-4 flex items-center justify-between gap-4'>
          <div className='relative max-w-sm flex-1'>
            <IconSearch className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Rechercher un utilisateur...'
              className='pl-8'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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

        <div className='rounded-lg border shadow-sm'>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : paginatedUsers ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <StatusBadge status={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <IconEdit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(user)}
                          >
                            <IconTrash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {paginatedUsers.total > 0 ? (
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={!paginatedUsers.prev_page_url}
                        />
                      </PaginationItem>
                      
                      {paginatedUsers.links.map((link, i) => (
                        <PaginationItem key={i}>
                          {link.url && (
                            <PaginationLink
                              onClick={() => {
                                if (link.url) {
                                  const page = new URL(link.url).searchParams.get('page') || '1'
                                  setCurrentPage(Number(page))
                                }
                              }}
                              isActive={link.active}
                            >
                              {link.label.replace('&laquo; ', '').replace(' &raquo;', '')}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={!paginatedUsers.next_page_url}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Aucun utilisateur trouvé
                </div>
              )}
            </>
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




