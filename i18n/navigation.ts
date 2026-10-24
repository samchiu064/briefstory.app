import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// 會自動帶上目前語系前綴的 Link / router
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
