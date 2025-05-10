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
                Simplifiez la gestion des paiements de vos chauffeurs
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Importez facilement les fichiers de paiements Uber, Bolt et Heetch, gérez les versements et suivez vos transactions en temps réel.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
                <Link to="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto bg-[#01631b] hover:bg-[#01631b]/90">
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link to="/sign-in">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Voir la démo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Image */}
        <div className="relative w-full -mt-20 mb-0 z-10 px-4 sm:px-6 lg:px-8">
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
                Fonctionnalités principales
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Tout ce dont vous avez besoin pour gérer efficacement vos paiements
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#01631b]/10">
                    <IconFileImport className="h-6 w-6 text-[#01631b]" />
                  </div>
                  <CardTitle>Import de fichiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Importez facilement les fichiers de paiements depuis Uber, Bolt et Heetch. Un processus simple et rapide pour gérer vos transactions.
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
                    Gérez facilement les versements à vos chauffeurs avec notre système de paiement intégré.
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
                    Accédez à des rapports détaillés et des analyses pour suivre vos transactions et optimiser vos opérations.
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
                    <span className="text-4xl font-bold">199,99€</span>
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
                    Comment fonctionne FleetPay ?
                  </AccordionTrigger>
                  <AccordionContent>
                    FleetPay est une plateforme qui simplifie la gestion des paiements pour les flottes de véhicules. 
                    Vous téléchargez les fichiers de paiements depuis Uber, Bolt et Heetch, les importez dans notre système, 
                    et nous calculons automatiquement les commissions et facilitons le versement des salaires aux chauffeurs.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Comment importer les fichiers de paiements ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Pour chaque plateforme (Uber, Bolt, Heetch), vous devez d'abord télécharger le fichier de paiements 
                    depuis leur interface respective. Ensuite, vous pouvez importer ce fichier dans FleetPay. 
                    Notre système traitera automatiquement les données et calculera les montants dus.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Comment sont calculées les commissions ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Les commissions sont calculées automatiquement selon les règles que vous définissez. 
                    Vous pouvez configurer différents taux de commission selon les chauffeurs, 
                    les périodes ou les types de courses.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Comment les chauffeurs sont-ils payés ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Les chauffeurs peuvent être payés par virement bancaire ou par d'autres méthodes 
                    que vous configurez. Le système calcule automatiquement les montants dus et 
                    génère les rapports nécessaires.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Y a-t-il un engagement de durée ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Non, il n'y a pas d'engagement de durée. Vous pouvez annuler votre abonnement 
                    à tout moment. Le plan gratuit est disponible sans limite de temps.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    Comment puis-je obtenir de l'aide ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Nous offrons un support par email et téléphone. Les utilisateurs du plan Pro 
                    bénéficient d'un support prioritaire, tandis que les clients Entreprise ont 
                    accès à un support dédié 24/7.
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
                Une question ? Un projet ? N'hésitez pas à nous contacter.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-xl">
              <ContactForm />
            </div>
          </div>
        </section>
      </Main>
      <HomeFooter />
    </>
  )
} 