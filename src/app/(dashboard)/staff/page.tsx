'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Phone, Plus, X } from 'lucide-react'
import type { StaffMember } from '@/types'

const DAYS = ['Ahad', 'Ithnayn', 'Thla', 'Arb3a', 'Khamis', 'Jma3a', 'Sebt']
const COLORS = ['#1D9E75', '#7F77DD', '#D85A30', '#378ADD', '#BA7517', '#888780']
const SERVICES = ['Qssa', 'Sbegha', 'Keratin', 'Balayage', 'L3roses', 'Ongles', 'Soin', 'Manucure']

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<StaffMember | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    color: COLORS[0],
    specialties: [] as string[],
    workingDays: [1, 2, 3, 4, 5] as number[],
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch('/api/staff', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        const formatted = data.map((s: any) => ({
          id: s.id || s._id,
          salonId: 's1',
          firstName: s.firstName || 'Unknown',
          lastName: s.lastName || '',
          phone: s.phone || '',
          color: s.color || COLORS[0],
          specialties: s.specialties || [],
          workingDays: s.workingDays || [1, 2, 3, 4, 5],
          active: true,
          appointmentsCount: 0,
          createdAt: s.createdAt || new Date().toISOString(),
          role: 'stylist',
        }))
        setStaff(formatted)
        if (formatted.length > 0) setSelected(formatted[0])
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStaff = async () => {
    if (!formData.firstName || !formData.phone) {
      alert('First name and phone are required')
      return
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          color: COLORS[0],
          specialties: [],
          workingDays: [1, 2, 3, 4, 5],
        })
        setShowForm(false)
        fetchStaff()
        alert('Staff member added')
      } else {
        alert('Failed to add staff')
      }
    } catch (error) {
      console.error('Error adding staff:', error)
      alert('Error adding staff')
    }
  }

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Delete this staff member?')) return

    setDeletingId(staffId)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        setStaff(staff.filter(s => s.id !== staffId))
        if (selected?.id === staffId) setSelected(staff[0] || null)
        alert('Staff deleted')
      } else {
        alert('Failed to delete staff')
      }
    } catch (error) {
      console.error('Error deleting staff:', error)
      alert('Error deleting staff')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Coiffeurs" subtitle={`${staff.length} coiffeurs actifs`} action={{ label: 'Coiffeur jdid', href: '#' }} />

      <div className="flex flex-1 overflow-hidden">
        {/* Cards list */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Kanladdi...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {staff.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`border rounded-xl p-5 cursor-pointer transition-all ${selected?.id === s.id ? 'border-foreground/30 shadow-sm' : 'border-border hover:border-foreground/20'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ background: s.color }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{s.firstName} {s.lastName}</p>
                        <p className="text-xs text-muted-foreground">Actif</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {s.specialties?.slice(0, 3).map(sp => (
                      <span key={sp} className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{sp}</span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Add card */}
              <div
                onClick={() => setShowForm(true)}
                className="border border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors min-h-[150px]">
                <div className="w-10 h-10 rounded-full border border-dashed border-border flex items-center justify-center">
                  <Plus size={16} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Zid coiffeur jdid</p>
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 border-l border-border flex flex-col overflow-y-auto">
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-medium text-lg" style={{ background: selected.color }}>
                  {selected.firstName[0]}{selected.lastName[0]}
                </div>
                <div>
                  <p className="font-medium">{selected.firstName} {selected.lastName}</p>
                  <p className="text-sm text-muted-foreground">Coiffeur/se</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <Phone size={13} className="text-muted-foreground" />
                {selected.phone}
              </div>

              {selected.specialties && selected.specialties.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Spécialités</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.specialties.map(sv => (
                      <span key={sv} className="text-xs px-2.5 py-1 rounded-full text-white" style={{ background: selected.color }}>
                        {sv}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Jours</p>
                <div className="flex gap-1.5">
                  {DAYS.map((d, di) => (
                    <div
                      key={d}
                      className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center font-medium ${selected.workingDays?.includes(di) ? 'text-white' : 'bg-secondary text-muted-foreground/40'}`}
                      style={selected.workingDays?.includes(di) ? { background: selected.color } : {}}>
                      {d[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border">
              <button
                onClick={() => selected && handleDeleteStaff(selected.id)}
                disabled={deletingId === selected?.id}
                className="w-full py-2 border border-destructive text-destructive rounded-lg text-xs hover:bg-red-50 transition-colors disabled:opacity-50">
                {deletingId === selected?.id ? 'Kaymsahel...' : 'Supp'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add staff modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-background border border-border rounded-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Coiffeur jdid</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
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
              <div>
                <label className="block text-xs font-medium mb-1.5">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-foreground' : 'border-border'}`}
                      style={{ background: color }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map(s => (
                    <button
                      key={s}
                      onClick={() => setFormData({
                        ...formData,
                        specialties: formData.specialties.includes(s)
                          ? formData.specialties.filter(x => x !== s)
                          : [...formData.specialties, s]
                      })}
                      className={`text-xs px-2 py-1 rounded-full transition-colors ${
                        formData.specialties.includes(s)
                          ? 'text-white'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                      style={formData.specialties.includes(s) ? { background: formData.color } : {}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="py-2 border border-border rounded-lg text-xs font-medium hover:bg-secondary transition-colors">
                Rja3
              </button>
              <button
                onClick={handleAddStaff}
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
