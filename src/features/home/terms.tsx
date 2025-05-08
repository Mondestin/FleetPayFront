import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { Link } from '@tanstack/react-router'

export function Terms() {
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
            <h1 className="text-3xl font-bold">Conditions d'utilisation</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Acceptation des conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                En accédant et en utilisant FleetPay, vous acceptez d'être lié par les présentes conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description du service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                FleetPay est une plateforme de gestion des paiements pour les chauffeurs Uber et Bolt. 
                Notre service permet d'importer, traiter et gérer les paiements de manière automatisée.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Obligations de l'utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Fournir des informations exactes et à jour</li>
                <li>Maintenir la confidentialité de votre compte</li>
                <li>Utiliser le service conformément aux lois en vigueur</li>
                <li>Ne pas utiliser le service à des fins illégales</li>
                <li>Ne pas tenter d'accéder à des parties non autorisées du service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Tous les droits de propriété intellectuelle relatifs à FleetPay, y compris mais sans s'y limiter, 
                les logiciels, le design, les logos et le contenu, sont la propriété exclusive de FleetPay.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Limitation de responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                FleetPay ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, 
                y compris la perte de profits, de données ou d'utilisation, résultant de l'utilisation ou de l'impossibilité 
                d'utiliser le service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Modifications des conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet 
                dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement ces conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à 
                support@fleet-pay.fr
              </p>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
} 