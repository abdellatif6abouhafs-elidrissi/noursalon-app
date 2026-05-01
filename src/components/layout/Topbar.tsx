'use client'

import { Bell, Plus } from 'lucide-react'
import Link from 'next/link'

interface TopbarProps {
  title: string
  subtitle?: string
  action?: { label: string; href?: string; onClick?: () => void }
}

export default function Topbar({ title, subtitle, action }: TopbarProps) {
  const today = new Date().toLocaleDateString('fr-MA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 py-3.5">
      <div>
        <h1 className="text-base font-medium text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">{subtitle ?? today}</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary transition-colors">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
        </button>

        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={14} />
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={14} />
              {action.label}
            </button>
          )
        )}
      </div>
    </header>
  )
}
