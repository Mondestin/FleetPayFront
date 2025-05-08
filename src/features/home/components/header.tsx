import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ThemeSwitch } from '@/components/theme-switch'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { useState } from 'react'

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/images/fleetpay-bgt.png"
                alt="FleetPay"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tarifs
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitch />
            <Link to="/sign-in">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link to="/sign-up">
              <Button className="bg-[#01631b] hover:bg-[#01631b]/90">
                S'inscrire
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeSwitch />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <IconX className="h-6 w-6" aria-hidden="true" />
              ) : (
                <IconMenu2 className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground text-left"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground text-left"
            >
              Tarifs
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground text-left"
            >
              Contact
            </button>
            <div className="mt-4 space-y-2">
              <Link
                to="/sign-in"
                className="block w-full rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
              </Link>
              <Link
                to="/sign-up"
                className="block w-full rounded-md bg-[#01631b] px-3 py-2 text-base font-medium text-white hover:bg-[#01631b]/90"
                onClick={() => setIsMenuOpen(false)}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 