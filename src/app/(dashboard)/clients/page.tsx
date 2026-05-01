'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Avatar from '@/components/ui/Avatar'
import { formatDH } from '@/lib/utils'
import { Search, Phone, Mail, MapPin, ChevronRight, Star } from 'lucide-react'
import type { Client } from '@/types'

const MOCK_CLIENTS: Client[] = [
  { id:'c1', salonId:'s1', firstName:'Fatima', lastName:'Zahra', phone:'+212 661 234 567', email:'fatima@gmail.com', city:'Casablanca', totalVisits:12, totalSpent:2640, lastVisit:'2026-04-24', createdAt:'2025-09-01' },
  { id:'c2', salonId:'s1', firstName:'Nadia', lastName:'Bensalem', phone:'+212 662 345 678', city:'Casablanca', totalVisits:8, totalSpent:1800, lastVisit:'2026-04-20', createdAt:'2025-10-15' },
  { id:'c3', salonId:'s1', firstName:'Khadija', lastName:'Moussaoui', phone:'+212 663 456 789', email:'khadija@gmail.com', city:'Casablanca', totalVisits:15, totalSpent:4200, lastVisit:'2026-04-18', createdAt:'2025-08-20' },
  { id:'c4', salonId:'s1', firstName:'Sara', lastName:'Benali', phone:'+212 664 567 890', city:'Mohammedia', totalVisits:5, totalSpent:750, lastVisit:'2026-04-15', createdAt:'2026-01-10' },
  { id:'c5', salonId:'s1', firstName:'Loubna', lastName:'El Fassi', phone:'+212 665 678 901', email:'loubna@gmail.com', city:'Casablanca', totalVisits:20, totalSpent:5600, lastVisit:'2026-04-10', createdAt:'2025-07-05' },
  { id:'c6', salonId:'s1', firstName:'Amina', lastName:'Mansouri', phone:'+212 666 789 012', city:'Casablanca', totalVisits:3, totalSpent:360, lastVisit:'2026-04-08', createdAt:'2026-02-20' },
  { id:'c7', salonId:'s1', firstName:'Zineb', lastName:'Alaoui', phone:'+212 667 890 123', city:'Rabat', totalVisits:7, totalSpent:1540, lastVisit:'2026-04-05', createdAt:'2025-11-30' },
  { id:'c8', salonId:'s1', firstName:'Meriem', lastName:'Khattabi', phone:'+212 668 901 234', email:'meriem@gmail.com', city:'Casablanca', totalVisits:11, totalSpent:2420, lastVisit:'2026-03-28', createdAt:'2025-09-18' },
]

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Client | null>(null)

  const filtered = MOCK_CLIENTS.filter(c =>
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Clients" subtitle={`${MOCK_CLIENTS.length} clients`} action={{ label: 'Client jdid', href: '/clients/new' }} />

      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search + filters */}
          <div className="px-6 py-4 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Kteb isem, telephone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30 transition-colors"
              />
            </div>
          </div>

          {/* Table header */}
          <div className="px-6 py-2 border-b border-border grid grid-cols-[2fr_1.5fr_1fr_1fr_40px] gap-4">
            {['Client', 'Tel / Email', 'Visites', 'Depensé', ''].map(h => (
              <span key={h} className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filtered.map((client, i) => (
              <div
                key={client.id}
                onClick={() => setSelected(client)}
                className="px-6 py-3.5 grid grid-cols-[2fr_1.5fr_1fr_1fr_40px] gap-4 items-center hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar firstName={client.firstName} lastName={client.lastName} size="sm" colorIndex={i} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{client.firstName} {client.lastName}</p>
                    <p className="text-xs text-muted-foreground">{client.city}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-foreground">{client.phone}</p>
                  {client.email && <p className="text-xs text-muted-foreground truncate">{client.email}</p>}
                </div>
                <p className="text-sm font-medium">{client.totalVisits}</p>
                <p className="text-sm font-medium text-teal-600">{formatDH(client.totalSpent)}</p>
                <ChevronRight size={14} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 border-l border-border flex flex-col overflow-y-auto">
            <div className="p-5 border-b border-border flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar firstName={selected.firstName} lastName={selected.lastName} size="md" colorIndex={0} />
                <div>
                  <p className="font-medium text-sm">{selected.firstName} {selected.lastName}</p>
                  <p className="text-xs text-muted-foreground">Client depuis {new Date(selected.createdAt).toLocaleDateString('fr-MA', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Visites</p>
                  <p className="text-xl font-medium">{selected.totalVisits}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Total dépensé</p>
                  <p className="text-sm font-medium text-teal-600">{formatDH(selected.totalSpent)}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone size={13} className="text-muted-foreground flex-shrink-0" />
                  <span>{selected.phone}</span>
                </div>
                {selected.email && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail size={13} className="text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{selected.email}</span>
                  </div>
                )}
                {selected.city && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <MapPin size={13} className="text-muted-foreground flex-shrink-0" />
                    <span>{selected.city}</span>
                  </div>
                )}
              </div>

              {selected.lastVisit && (
                <div className="border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Ziyara lakhira</p>
                  <p className="text-sm font-medium">{new Date(selected.lastVisit).toLocaleDateString('fr-MA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                  Maw3id jdid
                </button>
                <button className="flex-1 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:bg-secondary transition-colors">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
