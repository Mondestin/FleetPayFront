import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from './components/profile-form'
import { PasswordForm } from './components/password-form'
import { CommissionSettings } from './components/commission-settings'
import { IconUser, IconLock, IconPercentage, IconBuilding } from '@tabler/icons-react'
import { CompanyProfileForm } from './components/company-profile-form'

export default function Settings() {
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
            <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
            <p className="text-muted-foreground">
              Gérez vos paramètres de compte et préférences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <IconUser className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <IconLock className="h-4 w-4" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="commission" className="flex items-center gap-2">
                <IconPercentage className="h-4 w-4" />
                Commission
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <IconBuilding className="h-4 w-4" />
                Entreprise
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profil</CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>
                    Mettez à jour votre mot de passe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commission">
              <Card>
                <CardHeader>
                  <CardTitle>Commission</CardTitle>
                  <CardDescription>
                    Configurez le taux de commission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CommissionSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Profil entreprise</CardTitle>
                  <CardDescription>
                    Gérez les informations de votre entreprise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CompanyProfileForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
} 