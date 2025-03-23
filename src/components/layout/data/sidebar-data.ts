import {
  IconLayoutDashboard,
  IconUsers,
  IconFile,
  IconReportMoney,
  IconCreditCard,
  IconSettings,
  IconReceipt2
} from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'FleetPay Admin',
    email: 'admin@fleetpay.com',
    avatar: '/images/logo-mini.png',
  },
  teams: [
    {
      name: 'FleetPay',
      logo: '/images/logo-mini.png',
      plan: 'Administration',
    },
  ],
  navGroups: [
    {
      title: 'Général',
      items: [
        {
          title: 'Tableau de bord',
          url: '/dashboard' as const,
          icon: IconLayoutDashboard,
        },
        {
          title: 'Gestionnaire de fichiers',
          url: '/reports' as const,
          icon: IconFile,
        },
        {
          title: 'Chauffeurs',
          url: '/drivers' as const,
          icon: IconUsers,
        },
        {
          title: 'Rapports de paiement',
          url: '/payment-reports' as const,
          icon: IconReportMoney,
        },
        {
          title: 'Paramètres',
          url: '/settings' as const,
          icon: IconSettings,
        }
      ],
    },
    {
      title: 'Gestion des abonnements',
      items: [
        {
          title: 'Abonnements',
          url: '/subscriptions' as const,
          icon: IconCreditCard,
        },
        {
          title: 'Factures',
          url: '/invoices' as const,
          icon: IconReceipt2,
        },
        {
          title: 'Utilisateurs',
          url: '/users' as const,
          icon: IconUsers,
        },
      ],
    }
  ],
}
