import { IconUsers, IconFileImport, IconReportMoney, IconSettings } from '@tabler/icons-react'
import { Link, useRouter } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Importation',
    href: '/reports',
    icon: IconFileImport,
  },
  {
    name: 'Paiements',
    href: '/payment-reports',
    icon: IconReportMoney,
  },
  {
    name: 'Utilisateurs',
    href: '/users',
    icon: IconUsers,
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: IconSettings,
  },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = router.state.location.pathname

  return (
    <div className="flex h-full flex-col gap-y-5 bg-background border-r px-6 py-4">
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="/logo.svg"
          alt="Logo"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
} 