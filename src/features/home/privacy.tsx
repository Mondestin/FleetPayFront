import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { Link } from '@tanstack/react-router'

export function Privacy() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">FleetPay</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
          </div>
        </div>
      </header>

      <Main>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Collecte des informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nous collectons les informations suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Informations d'identification (nom, prénom, email)</li>
                <li>Informations de l'entreprise</li>
                <li>Données de paiement et transactions</li>
                <li>Informations sur les chauffeurs</li>
                <li>Données d'utilisation du service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Utilisation des informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Les informations collectées sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Fournir et améliorer nos services</li>
                <li>Traiter les paiements</li>
                <li>Communiquer avec vous</li>
                <li>Respecter nos obligations légales</li>
                <li>Prévenir la fraude</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Protection des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles 
                contre tout accès non autorisé, altération, divulgation ou destruction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Partage des informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nous ne partageons vos informations qu'avec :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Les prestataires de services nécessaires au fonctionnement de notre plateforme</li>
                <li>Les autorités légales lorsque la loi l'exige</li>
                <li>Les partenaires commerciaux avec votre consentement explicite</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Vos droits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez contrôler 
                l'utilisation des cookies via les paramètres de votre navigateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Pour toute question concernant notre politique de confidentialité ou pour exercer vos droits, 
                veuillez nous contacter à privacy@fleet-pay.fr
              </p>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
} 