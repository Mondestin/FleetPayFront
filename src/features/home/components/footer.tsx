import { Link } from '@tanstack/react-router'
import { IconMail, IconClock } from '@tabler/icons-react'

export function HomeFooter() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-muted/50 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Company */}
            <div>
              <Link to="/" className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/images/fleetpay-bgt.png"
                  alt="FleetPay"
                />
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Simplifiez la gestion des paiements de vos chauffeurs avec notre solution innovante.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold">Navigation</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Fonctionnalités
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Tarifs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold">Légal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="mailto:support@fleetpay.fr"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <IconMail className="h-4 w-4" />
                    support@fleet-pay.fr
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconClock className="h-4 w-4" />
                    <span>Support 24/7</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} FleetPay. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 