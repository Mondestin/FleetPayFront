import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HomeHeader } from './header'
import { HomeFooter } from './footer'

export function Terms() {
  return (
    <>
      <HomeHeader />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="bg-muted/50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Conditions d'utilisation
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long'})}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-green max-w-none">
              <Card>
                <CardHeader>
                  <CardTitle>1. Acceptation des conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    En accédant et en utilisant FleetPay, vous acceptez d'être lié par les présentes conditions d'utilisation.
                    Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>2. Description du service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    FleetPay est une plateforme de gestion des paiements pour les flottes de véhicules.
                    Notre service permet d'importer automatiquement les paiements depuis Uber et Bolt,
                    de gérer les versements aux chauffeurs et de suivre les transactions en temps réel.
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>3. Obligations de l'utilisateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    En utilisant FleetPay, vous vous engagez à :
                  </p>
                  <ul>
                    <li>Fournir des informations exactes et à jour</li>
                    <li>Maintenir la confidentialité de votre compte</li>
                    <li>Utiliser le service conformément aux lois en vigueur</li>
                    <li>Ne pas utiliser le service à des fins illégales</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>4. Propriété intellectuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Tous les droits de propriété intellectuelle relatifs à FleetPay sont la propriété exclusive
                    de notre entreprise. Vous n'êtes pas autorisé à copier, modifier ou distribuer notre service
                    sans autorisation écrite.
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>5. Limitation de responsabilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    FleetPay est fourni "tel quel", sans garantie d'aucune sorte. Nous ne serons pas responsables
                    des dommages indirects résultant de l'utilisation de notre service.
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>6. Modifications des conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications
                    entrent en vigueur dès leur publication sur le site.
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>7. Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Pour toute question concernant ces conditions, veuillez nous contacter à :
                    <br />
                    <a href="mailto:support@fleetpay.fr" className="text-[#01631b] hover:underline">
                      support@fleetpay.fr
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  )
} 