import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HomeHeader } from './header'
import { HomeFooter } from './footer'

export function Privacy() {
  return (
    <>
      <HomeHeader />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="bg-muted/50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Politique de confidentialité
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
                  <CardTitle>1. Collecte des informations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous collectons les informations suivantes :
                  </p>
                  <ul>
                    <li>Informations de compte (nom, email, entreprise)</li>
                    <li>Données de paiement (transactions Uber et Bolt)</li>
                    <li>Informations de connexion et d'utilisation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>2. Utilisation des informations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Les informations collectées sont utilisées pour :
                  </p>
                  <ul>
                    <li>Fournir et améliorer nos services</li>
                    <li>Gérer les paiements et les transactions</li>
                    <li>Communiquer avec vous concernant votre compte</li>
                    <li>Assurer la sécurité de notre plateforme</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>3. Protection des données</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
                  </p>
                  <ul>
                    <li>Chiffrement des données sensibles</li>
                    <li>Accès restreint aux informations personnelles</li>
                    <li>Surveillance régulière de nos systèmes</li>
                    <li>Formation de notre personnel à la sécurité</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>4. Partage des données</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous ne partageons vos données qu'avec :
                  </p>
                  <ul>
                    <li>Les prestataires de services nécessaires</li>
                    <li>Les autorités légales si requis par la loi</li>
                    <li>Votre consentement explicite</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>5. Vos droits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Conformément au RGPD, vous disposez des droits suivants :
                  </p>
                  <ul>
                    <li>Droit d'accès à vos données</li>
                    <li>Droit de rectification</li>
                    <li>Droit à l'effacement</li>
                    <li>Droit à la portabilité des données</li>
                    <li>Droit d'opposition au traitement</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>6. Cookies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous utilisons des cookies pour améliorer votre expérience sur notre site.
                    Vous pouvez contrôler l'utilisation des cookies via les paramètres de votre navigateur.
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>7. Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Pour toute question concernant notre politique de confidentialité, contactez-nous à :
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