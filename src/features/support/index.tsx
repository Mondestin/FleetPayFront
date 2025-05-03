import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconHelp, IconMessage, IconClock } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export function Support() {
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
        <h1 className="text-3xl font-bold">Support</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconHelp className="h-5 w-5" />
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Questions fréquentes</h3>
              <ul className="space-y-4">
                <li>
                  <h4 className="font-medium">Comment importer des rapports ?</h4>
                  <p className="text-sm text-muted-foreground">
                    Accédez à la section "Rapports de paiement" et utilisez le bouton "Importer" pour télécharger vos fichiers.
                  </p>
                </li>
                <li>
                  <h4 className="font-medium">Comment gérer les paiements ?</h4>
                  <p className="text-sm text-muted-foreground">
                    Les paiements peuvent être gérés depuis la section "Rapports de paiement" où vous pouvez voir et traiter tous les paiements.
                  </p>
                </li>
                <li>
                  <h4 className="font-medium">Comment exporter les fichiers de paiements Uber et Bolt ?</h4>
                  <p className="text-sm text-muted-foreground">
                    Les fichiers doivent être exportés en anglais car les en-têtes ne sont reconnus qu'en anglais. Changez les paramètres de votre compte en anglais avant d'exporter les rapports.
                  </p>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMessage className="h-5 w-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Contactez-nous</h3>
              <p className="text-sm text-muted-foreground">
                Notre équipe de support est disponible pour vous aider.
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <IconClock className="h-4 w-4" />
                  <span>Lundi - Vendredi: 9h - 18h</span>
                </p>
                <p className="flex items-center gap-2">
                  <IconMessage className="h-4 w-4" />
                  <span>support@fleetpay.com</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      </Main>
      </>
  )
} 