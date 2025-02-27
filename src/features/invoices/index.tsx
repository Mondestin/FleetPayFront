'use client'

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { InvoicesList } from './components/invoices-list'


export default function Invoices() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Factures</h2>
          <p className='text-muted-foreground'>
            Gérez les factures des utilisateurs
          </p>
        </div>
      <InvoicesList />
      </Main>
    </>
  )
} 