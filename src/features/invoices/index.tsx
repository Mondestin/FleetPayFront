import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { InvoicesList } from './components/invoices-list'

export function Invoices() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Gestion des Factures</h2>
          <p className='text-muted-foreground'>
            Gérez vos factures et leurs informations
          </p>
        </div>

        <div className='rounded-lg border shadow-sm'>
          <InvoicesList />
        </div>
      </Main>
    </>
  )
} 