import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconVideo, IconFileText } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export function Instructions() {
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Instructions</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Documentation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Guides d'utilisation</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>Guide de démarrage rapide</li>
                <li>Gestion des chauffeurs</li>
                <li>Importation des rapports</li>
                <li>Configuration des paiements</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Video Tutorials Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconVideo className="h-5 w-5" />
              Tutoriels vidéo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Vidéos explicatives</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>Premiers pas avec FleetPay</li>
                <li>Comment importer des rapports</li>
                <li>Gestion des paiements</li>
                <li>Configuration du système</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </Main>
    </>
  )
} 