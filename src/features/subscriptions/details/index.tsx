import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { subscriptionService } from '../data/subscription-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { IconArrowLeft } from '@tabler/icons-react'

export default function SubscriptionDetails() {
  const { id } = useParams({ from: '/_authenticated/subscription/$id' })
  const navigate = useNavigate()

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionService.getSubscriptionWithInvoices(id),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!subscription) {
    return <div>Abonnement non trouvé</div>
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
          <h2 className='text-2xl font-bold tracking-tight'>Détails de l'abonnement</h2>
          <p className='text-muted-foreground'>
            Informations détaillées de l'abonnement
          </p>
        </div>

        <div className="grid gap-6">
          {/* Combined User and Subscription Details Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Détails de l'abonnement</CardTitle>
            
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* User Section - Left */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informations du client</h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>
                        {subscription.user.last_name[0]}{subscription.user.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">
                        {subscription.user.first_name} {subscription.user.last_name}
                      </h4>
                      <p className="text-muted-foreground">{subscription.user.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-start mt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate({ to: '/subscriptions' })}
                      className="gap-2 mt-4"
                      >
                        <IconArrowLeft className="h-4 w-4" />
                      Retour aux abonnements
                    </Button>
                  </div>
                </div>

                {/* Subscription Section - Right */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informations de l'abonnement</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Montant</p>
                        <p>€{subscription.amount}/mois</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Statut</p>
                        <StatusBadge status={subscription.status} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Statut de paiement</p>
                        <StatusBadge status={subscription.payment_status} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date de début</p>
                        <p>{format(new Date(subscription.start_date), 'dd MMM yyyy', { locale: fr })}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date de fin</p>
                        <p>{format(new Date(subscription.end_date), 'dd MMM yyyy', { locale: fr })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Card */}
          <Card>
            <CardHeader>
              <CardTitle>Factures</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscription.invoices?.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoice_number}</TableCell>
                      <TableCell>
                        {format(new Date(invoice.created_at), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>€{invoice.amount}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
} 