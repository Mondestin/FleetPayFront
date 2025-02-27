import { LinkProps } from '@tanstack/react-router'
import { type ElementType } from 'react'

interface User {
  name: string
  email: string
  avatar: string
}

interface Team {
  name: string
  logo: ElementType | string
  plan: string
}

interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
  disabled?: boolean
}

type NavLink = BaseNavItem & {
  url: string
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] })[]
  url?: undefined
}

type NavItem = NavLink | NavCollapsible | (BaseNavItem & { url: LinkProps['to'] })

interface NavGroup {
  title: string
  items: NavItem[]
}

interface SidebarData {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
