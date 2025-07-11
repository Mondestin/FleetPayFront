import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { HomeHeader } from './components/header'
import { HomeFooter } from './components/footer'
import { Link } from '@tanstack/react-router'
import {
  IconFileImport,
  IconMoneybag,
  IconChartBar,
  IconArrowRight,
  IconCheck,
} from '@tabler/icons-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ContactForm } from './components/contact-form'
import { CookieConsent } from './components/cookie-consent'

export function Home() {
  return (
    <>
      <HomeHeader />
      <Main>
        {/* Hero Section */}
        <section id="hero" className="relative overflow-hidden py-70 sm:py-32 mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Gestion simplifiée des paiements VTC
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                Importez vos fichiers Uber, Bolt et Heetch. Calculez automatiquement les commissions et gérez vos paiements en quelques clics.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
                <Link to="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto bg-[#01631b] hover:bg-[#01631b]/90">
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Voir la démo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Image */}
        <div className="relative w-full -mt-10 mb-0 z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <img
              src="/images/dashboard.png"
              alt="Dashboard"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Une solution complète pour votre activité
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                FleetPay simplifie votre quotidien, vous permettant de vous concentrer sur l'essentiel : votre activité.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#01631b]/10">
                    <IconFileImport className="h-6 w-6 text-[#01631b]" />
                  </div>
                  <CardTitle>Import simplifié</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Importez facilement vos fichiers de paiements depuis Uber, Bolt et Heetch. En quelques clics, vous centralisez toutes vos transactions sur une seule plateforme.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#01631b]/10">
                    <IconMoneybag className="h-6 w-6 text-[#01631b]" />
                  </div>
                  <CardTitle>Gestion des paiements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Grâce à notre système intégré, gérez les versements à vos chauffeurs de manière fluide, rapide et sécurisée.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#01631b]/10">
                    <IconChartBar className="h-6 w-6 text-[#01631b]" />
                  </div>
                  <CardTitle>Rapports détaillés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accédez à des rapports détaillés pour analyser vos performances, suivre vos revenus et optimiser vos opérations. Visualisez vos statistiques hebdomadaires et mensuelles grâce à un tableau de bord clair et intuitif.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Supported Platforms Section */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-lg font-semibold text-muted-foreground">
                Plateformes supportées
              </h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                <img
                  src="/images/uber.png"
                  alt="Uber"
                  className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all hover:scale-110"
                />
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="/images/bolt-logo.jpg"
                  alt="Bolt"
                  className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all hover:scale-110"
                />
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="/images/heetch.png"
                  alt="Heetch"
                  className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all hover:scale-110"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Comment ça marche
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                En quelques étapes simples, commencez à gérer vos paiements efficacement
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center relative">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#01631b] text-white">
                  1
                </div>
                <h3 className="text-lg font-semibold">Téléchargement</h3>
                <p className="mt-2 text-muted-foreground">
                  Téléchargez les fichiers de paiements depuis Uber, Bolt et Heetch
                </p>
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <IconArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="text-center relative">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#01631b] text-white">
                  2
                </div>
                <h3 className="text-lg font-semibold">Import</h3>
                <p className="mt-2 text-muted-foreground">
                  Importez les fichiers dans FleetPay
                </p>
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <IconArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="text-center relative">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#01631b] text-white">
                  3
                </div>
                <h3 className="text-lg font-semibold">Calcul</h3>
                <p className="mt-2 text-muted-foreground">
                  Calculez automatiquement les montants dus
                </p>
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <IconArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#01631b] text-white">
                  4
                </div>
                <h3 className="text-lg font-semibold">Paiement</h3>
                <p className="mt-2 text-muted-foreground">
                  Effectuez les versements aux chauffeurs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Tarifs simples et transparents
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choisissez le plan qui correspond à vos besoins
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Free Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Gratuit</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">0€</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Jusqu'à 50 chauffeurs</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Importation Uber, Bolt et Heetch</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Tableau de bord basique</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-8 bg-[#01631b] hover:bg-[#01631b]/90">
                    Commencer gratuitement
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-[#01631b]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Plan Pro</CardTitle>
                    <span className="bg-[#01631b] text-white px-3 py-1 rounded-full text-sm">
                      Populaire
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">99,99€</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Jusqu'à 150 chauffeurs</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Importation Uber, Bolt et Heetch</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Tableau de bord avancé</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Support prioritaire</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Rapports détaillés</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Exportation des rapports en Excel</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-8 bg-[#01631b] hover:bg-[#01631b]/90">
                    Choisir le plan Pro
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Entreprise</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Sur mesure</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Toutes les fonctionnalités du plan Pro</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Plus de 150 chauffeurs</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>API personnalisée</span>
                    </li>
                    <li className="flex items-center">
                      <IconCheck className="h-5 w-5 text-[#01631b] mr-2" />
                      <span>Support dédié 24/7</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-8 bg-[#01631b] hover:bg-[#01631b]/90">
                    Contactez-nous
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Image Section */}
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <img
              src="/images/rapport.png"
              alt="Rapports détaillés"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Questions fréquentes
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tout ce que vous devez savoir sur FleetPay
              </p>
            </div>

            <div className="mt-16 max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Quelles plateformes sont supportées ?
                  </AccordionTrigger>
                  <AccordionContent>
                    FleetPay supporte les trois principales plateformes VTC : Uber, Bolt et Heetch. 
                    Vous pouvez importer les fichiers de paiements de ces plateformes et les traiter 
                    automatiquement dans notre système.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Comment fonctionne l'import des fichiers ?
                  </AccordionTrigger>
                  <AccordionContent>
                    L'import est simple : téléchargez vos fichiers CSV depuis Uber et Bolt, ou PDF depuis Heetch, 
                    puis importez-les dans FleetPay. Notre système traite automatiquement les données, 
                    calcule les commissions et génère les rapports de paiement.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Quels sont les avantages du plan Pro ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Le plan Pro (99,99€/mois) inclut jusqu'à 150 chauffeurs, un tableau de bord avancé, 
                    des rapports détaillés, l'export Excel, et un support prioritaire. 
                    Parfait pour les flottes en croissance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Le plan gratuit est-il vraiment gratuit ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Oui, le plan gratuit est entièrement gratuit sans limite de temps. 
                    Il inclut jusqu'à 50 chauffeurs, l'import des trois plateformes, 
                    et un tableau de bord basique. Aucune carte de crédit requise.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Comment sont calculées les commissions ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Les commissions sont calculées automatiquement selon vos règles personnalisées. 
                    Vous pouvez définir différents taux selon les chauffeurs, les périodes ou les types de courses. 
                    Le système applique ces règles et génère les rapports de paiement.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    Mes données sont-elles sécurisées ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Absolument. Nous utilisons des protocoles de sécurité de niveau bancaire pour protéger vos données. 
                    Toutes les informations sont chiffrées et stockées de manière sécurisée. 
                    Nous respectons également le RGPD pour la protection de vos données personnelles.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    Puis-je annuler à tout moment ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Oui, vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires. 
                    Aucun engagement de durée n'est requis. Vous gardez l'accès à vos données 
                    jusqu'à la fin de votre période de facturation.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>
                    Comment obtenir de l'aide ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Notre équipe support est disponible par email et téléphone. Les utilisateurs Pro 
                    bénéficient d'un support prioritaire, et les clients Entreprise ont accès à un support dédié 24/7. 
                    Nous répondons généralement dans les 24h.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Pourquoi choisir FleetPay ?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Une solution complète pour la gestion de vos paiements
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#01631b]/10">
                  <IconCheck className="h-5 w-5 text-[#01631b]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Gain de temps</h3>
                  <p className="mt-2 text-muted-foreground">
                    Importez facilement vos fichiers et économisez des heures de travail manuel
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#01631b]/10">
                  <IconCheck className="h-5 w-5 text-[#01631b]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Fiabilité</h3>
                  <p className="mt-2 text-muted-foreground">
                    Des calculs précis et une traçabilité complète de toutes vos transactions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#01631b]/10">
                  <IconCheck className="h-5 w-5 text-[#01631b]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Support 24/7</h3>
                  <p className="mt-2 text-muted-foreground">
                    Une équipe dédiée à votre service pour répondre à toutes vos questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="trial" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative isolate overflow-hidden bg-[#01631b] px-6 py-24 text-center sm:rounded-3xl sm:px-16">
              <h2 className="mx-auto text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Essayez le plan Pro gratuitement pendant 2 semaines
              </h2>
              <p className="mx-auto mt-6 text-lg leading-8 text-white/90">
                Rejoignez des centaines de gestionnaires de flotte qui font confiance à FleetPay
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link to="/sign-up">
                  <Button size="lg" className="bg-white text-[#01631b] hover:bg-white/90">
                    Commencer l'essai gratuit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* Contact Form Section */}
        <section id="contact" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Contactez-nous
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Une question ? N'hésitez pas à nous contacter.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-xl">
              <ContactForm />
            </div>
          </div>
        </section>
      </Main>
      <HomeFooter />
      <CookieConsent />
    </>
  )
} 