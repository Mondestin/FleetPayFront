import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconMail, IconMessageQuestion } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'

export default function Support() {
  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          {/* Add any header actions here */}
        </div>
      </Header>

      <Main>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Instructions & Support</h2>
            <p className="text-muted-foreground">
              Trouvez l'aide dont vous avez besoin pour utiliser FleetPay
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconMessageQuestion className="h-5 w-5" />
                  FAQ
                </CardTitle>
                <CardDescription>
                  Questions fréquemment posées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Comment importer mes rapports ?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Accédez à la section "Gestionnaire de fichiers" et suivez les instructions pour importer vos rapports au format CSV.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Comment gérer les paiements ?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Utilisez la section "Rapports de paiement" pour voir et gérer tous les paiements de vos chauffeurs.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Comment exporter les fichiers de paiements Uber et Bolt ?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pour <b>Uber</b> et <b>Bolt</b>, assurez-vous d'exporter les fichiers de paiements en anglais car les en-têtes sont considérés uniquement dans cette langue. Dans les paramètres de votre compte Uber/Bolt, changez la langue en anglais avant d'exporter les rapports si besoin.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconMail className="h-5 w-5" />
                  Contactez le support
                </CardTitle>
                <CardDescription>
                  Notre équipe est là pour vous aider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <IconMail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">support@phoenone.com</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Horaires d'ouverture :</p>
                    <p>Lundi - Vendredi : 9h00 - 18h00</p>
                    <p>Samedi : 9h00 - 13h00</p>
                  </div>
                </div>
                <Button className="w-full bg-primary text-white hover:bg-primary/90" onClick={() => window.location.href = 'mailto:support@phoenone.com'}>
                  Envoyer un message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
} 