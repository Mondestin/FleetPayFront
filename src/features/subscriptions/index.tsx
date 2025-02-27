import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { SubscriptionsList } from './components/subscriptions-list'

export default function Subscriptions() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Gestion des abonnements</h2>
          <p className='text-muted-foreground'>
            Gérez les abonnements des utilisateurs
          </p>
        </div>
        <SubscriptionsList />
      </Main>
    </>
  )
} 