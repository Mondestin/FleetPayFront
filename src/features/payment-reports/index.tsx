import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { PaymentReportsList } from './components/payment-reports-list'

export default function PaymentReports() {
  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold tracking-tight'>Rapports de Paiement</h2>
          <p className='text-muted-foreground'>
            Suivi des paiements hebdomadaires par plateforme
          </p>
        </div>

        <div className='rounded-lg border shadow-sm'>
          <PaymentReportsList />
        </div>
      </Main>
    </>
  )
} 