'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'
import Avatar from '@/components/ui/Avatar'
import { Search, Phone, Mail, MapPin, ChevronRight } from 'lucide-react'
import type { Client } from '@/types'

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', email: '', city: '' })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch('/api/clients', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        const formatted = data.map((c: any) => ({
          id: c.id || c._id,
          salonId: 's1',
          firstName: c.firstName || 'Unknown',
          lastName: c.lastName || '',
          phone: c.phone || '',
          email: c.email || '',
          city: c.city || '',
          totalVisits: 0,
          totalSpent: 0,
          lastVisit: '',
          createdAt: c.createdAt || new Date().toISOString(),
        }))
        setClients(formatted)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async () => {
    if (!formData.firstName || !formData.phone) {
      alert('First name and phone are required')
      return
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ firstName: '', lastName: '', phone: '', email: '', city: '' })
        setShowForm(false)
        fetchClients()
        alert('Client added successfully')
      } else {
        alert('Failed to add client')
      }
    } catch (error) {
      console.error('Error adding client:', error)
      alert('Error adding client')
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Delete this client?')) return

    setDeletingId(clientId)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        setClients(clients.filter(c => c.id !== clientId))
        setSelected(null)
        alert('Client deleted')
      } else {
        alert('Failed to delete client')
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Error deleting client')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = clients.filter(c =>
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Clients" subtitle={`${clients.length} clients`} action={{ label: 'Client jdid', href: '#' }} />

      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
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
          <div className="px-6 py-2 border-b border-border grid grid-cols-[2fr_1.5fr_1fr_40px] gap-4">
            {['Client', 'Tel / Email', 'City', ''].map(h => (
              <span key={h} className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Kanladdi...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                  + Zid client awwal
                </button>
              </div>
            ) : (
              filtered.map((client, i) => (
                <div
                  key={client.id}
                  onClick={() => setSelected(client)}
                  className="px-6 py-3.5 grid grid-cols-[2fr_1.5fr_1fr_40px] gap-4 items-center hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar firstName={client.firstName} lastName={client.lastName} size="sm" colorIndex={i} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{client.firstName} {client.lastName}</p>
                      <p className="text-xs text-muted-foreground">{client.city || '—'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{client.phone}</p>
                    {client.email && <p className="text-xs text-muted-foreground truncate">{client.email}</p>}
                  </div>
                  <p className="text-sm text-muted-foreground">{client.city || '—'}</p>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              ))
            )}
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
                  <p className="text-xs text-muted-foreground">Added {new Date(selected.createdAt).toLocaleDateString('fr-MA')}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>

            <div className="p-5 space-y-4 flex-1">
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
            </div>

            <div className="p-5 border-t border-border space-y-2">
              <button
                onClick={() => { setShowForm(true); setSelected(null) }}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                Zid maw3id
              </button>
              <button
                onClick={() => selected && handleDeleteClient(selected.id)}
                disabled={deletingId === selected?.id}
                className="w-full py-2 border border-destructive text-destructive rounded-lg text-xs hover:bg-red-50 transition-colors disabled:opacity-50">
                {deletingId === selected?.id ? 'Kaymsahel...' : 'Supp'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add client modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-background border border-border rounded-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Client jdid</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground text-lg">×</button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
              />
              <input
                type="text"
                placeholder="City (optional)"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="py-2 border border-border rounded-lg text-xs font-medium hover:bg-secondary transition-colors">
                Rja3
              </button>
              <button
                onClick={handleAddClient}
                className="py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                Zid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
