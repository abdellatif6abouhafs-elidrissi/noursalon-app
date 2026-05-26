'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { authService } from '@/lib/auth'
import {
  LayoutDashboard, CalendarDays, Users, Scissors,
  Settings, BarChart3, CreditCard, LogOut,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#1D9E75' },
  { href: '/appointments', label: 'Mawa3id', icon: CalendarDays, color: '#378ADD' },
  { href: '/clients', label: 'Clients', icon: Users, color: '#888780' },
  { href: '/staff', label: 'Coiffeurs', icon: Scissors, color: '#BA7517' },
  null, // divider
  { href: '/stats', label: 'Statistiques', icon: BarChart3, color: '#888780' },
  { href: '/billing', label: 'Paiements', icon: CreditCard, color: '#D85A30' },
  { href: '/settings', label: 'Paramètres', icon: Settings, color: '#888780' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const user = authService.getUser()

  return (
    <aside className="w-[220px] bg-zinc-950 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-base">
          ✂
        </div>
        <span className="text-white font-serif text-lg">NourSalon</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item, i) => {
          if (!item) return <div key={i} className="my-3 border-t border-white/5" />
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/45 hover:bg-white/6 hover:text-white/80'
              )}
            >
              <Icon size={15} style={{ color: active ? item.color : undefined }} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {user?.name ? `${user.name[0]}` : '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-white/35 text-xs truncate">
              {user?.salonName || 'Salon'}
            </p>
          </div>
        </div>
        <button
          onClick={() => authService.logout()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 text-sm transition-all"
        >
          <LogOut size={14} />
          Khrouj
        </button>
      </div>
    </aside>
  )
}
