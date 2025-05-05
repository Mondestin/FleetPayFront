import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionDetails } from '@/features/subscription-details/components/subscription-details'

export default function SubscriptionDetailsPage() {
  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Mon abonnement</h2>
            <p className="text-muted-foreground">
              Gérez votre abonnement et facturation
            </p>
          </div>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Détails de l'abonnement</CardTitle>
                <CardDescription>
                  Consultez et gérez votre abonnement actuel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriptionDetails />
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
} 