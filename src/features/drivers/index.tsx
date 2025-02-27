import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { DriversList } from './components/drivers-list'

export default function Drivers() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Gestion des Chauffeurs</h2>
          <p className='text-muted-foreground'>
            Gérez vos chauffeurs et leurs informations
          </p>
        </div>

        <div className='rounded-lg border shadow-sm'>
          <DriversList />
        </div>
      </Main>
    </>
  )
} 