import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { IconCookie } from '@tabler/icons-react'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted')
    if (!hasAcceptedCookies) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <IconCookie className="h-6 w-6 text-[#01631b]" />
          <div>
            <h3 className="font-semibold">Nous utilisons des cookies</h3>
            <p className="text-sm text-muted-foreground">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
              En continuant à naviguer, vous acceptez notre utilisation des cookies.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleAccept}
          className="bg-[#01631b] hover:bg-[#01631b]/90"
        >
          Accepter
        </Button>
      </div>
    </div>
  )
} 