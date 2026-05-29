'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'
import StatusBadge from '@/components/ui/StatusBadge'
import Avatar from '@/components/ui/Avatar'
import { formatDH } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react'
import type { Appointment, AppointmentStatus } from '@/types'

const DAYS_AR = ['Had', 'Ithnayn', 'Thla', 'Arb3a', 'Khamis', 'Jma3a', 'Sebt']
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8)
const HOUR_H = 60

function getWeekDates(date: Date) {
  const day = date.getDay()
  const diff = date.getDate() - day
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date)
    d.setDate(diff + i)
    return d
  })
}

function timeToMin(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export default function AppointmentsPage() {
  const [view, setView] = useState<'week' | 'list'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'all'>('all')
  const [savedAppts, setSavedAppts] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ time: '', notes: '' })

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch('/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const formattedAppts = data.map((appt: any) => ({
            id: appt.id || appt._id,
            salonId: 's1',
            clientId: appt.clientId,
            client: {
              id: appt.clientId,
              firstName: appt.clientName?.split(' ')[0] || 'Unknown',
              lastName: appt.clientName?.split(' ')[1] || '',
              phone: '',
            },
            staffId: appt.staffId,
            staff: {
              id: appt.staffId,
              firstName: appt.staffName || 'Unknown',
              lastName: '',
              color: '#1D9E75',
            },
            serviceId: appt.serviceId,
            service: {
              id: appt.serviceId,
              name: appt.serviceName || 'Unknown',
              duration: 60,
              price: appt.price || 0,
              color: '#1D9E75',
            },
            date: appt.date,
            startTime: appt.time || '09:00',
            endTime: '18:00',
            status: (appt.status || 'confirmed') as AppointmentStatus,
            price: appt.price || 0,
            createdAt: '',
          }))
          setSavedAppts(formattedAppts)
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const weekDates = getWeekDates(currentDate)
  const weekStart = weekDates[0]
  const weekEnd = weekDates[6]
  const fmt = (d: Date) => d.toISOString().split('T')[0]

  const weekAppts = savedAppts.filter(a => {
    const inWeek = a.date >= fmt(weekStart) && a.date <= fmt(weekEnd)
    const statusOk = filterStatus === 'all' || a.status === filterStatus
    return inWeek && statusOk
  })

  const getApptsByDate = (date: Date) => weekAppts.filter(a => a.date === fmt(date))

  const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d) }
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d) }
  const isToday = (d: Date) => fmt(d) === fmt(new Date())

  const handleCancelAppointment = async (apptId: string) => {
    if (!confirm('Confirm cancellation of this appointment?')) return

    setCancelingId(apptId)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch(`/api/appointments/${apptId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSavedAppts(savedAppts.filter(a => a.id !== apptId))
        setSelectedAppt(null)
        alert('Appointment cancelled successfully')
      } else {
        alert('Failed to cancel appointment')
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      alert('Error cancelling appointment')
    } finally {
      setCancelingId(null)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedAppt) return

    setEditingId(selectedAppt.id)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch(`/api/appointments/${selectedAppt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          time: editForm.time,
          notes: editForm.notes,
        }),
      })

      if (response.ok) {
        const updated = { ...selectedAppt, startTime: editForm.time, notes: editForm.notes }
        setSavedAppts(savedAppts.map(a => a.id === selectedAppt.id ? updated : a))
        setSelectedAppt(updated)
        setEditingId(null)
        alert('Appointment updated successfully')
      } else {
        alert('Failed to update appointment')
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      alert('Error updating appointment')
    } finally {
      setEditingId(null)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar
        title="Mawa3id"
        subtitle={`${weekAppts.length} mawa3id lisbou3`}
        action={{ label: 'Maw3id jdid', href: '/appointments/new' }}
      />

      <div className="flex items-center justify-between px-6 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={prevWeek} className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 h-8 text-xs font-medium border border-border rounded-lg hover:bg-secondary transition-colors">
              Lyoum
            </button>
            <button onClick={nextWeek} className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
          <span className="text-sm font-medium">
            {weekStart.toLocaleDateString('fr-MA', { day: 'numeric', month: 'long' })} — {weekEnd.toLocaleDateString('fr-MA', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as AppointmentStatus | 'all')}
            className="h-8 px-3 text-xs border border-border rounded-lg bg-background focus:outline-none">
            <option value="all">Koll statuts</option>
            <option value="confirmed">Mta2kad</option>
            <option value="pending">Mellalq</option>
            <option value="done">Kamal</option>
            <option value="cancelled">Mlgh</option>
          </select>
          <div className="flex bg-secondary rounded-lg p-0.5">
            <button onClick={() => setView('week')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${view === 'week' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
              <Calendar size={12} /> Lisbou3
            </button>
            <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${view === 'list' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
              <List size={12} /> Lista
            </button>
          </div>
        </div>
      </div>

      {view === 'week' && (
        <div className="flex-1 overflow-auto">
          <div className="grid sticky top-0 z-10 bg-background border-b border-border" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
            <div className="h-12" />
            {weekDates.map((d, i) => (
              <div key={i} className="h-12 flex flex-col items-center justify-center border-l border-border">
                <span className="text-xs text-muted-foreground">{DAYS_AR[d.getDay()]}</span>
                <span className={`text-sm font-medium mt-0.5 w-7 h-7 flex items-center justify-center rounded-full ${isToday(d) ? 'bg-primary text-primary-foreground' : ''}`}>
                  {d.getDate()}
                </span>
              </div>
            ))}
          </div>
          <div className="grid" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
            <div>
              {HOURS.map(h => (
                <div key={h} className="h-[60px] flex items-start justify-end pr-2 pt-1">
                  <span className="text-xs text-muted-foreground">{h}:00</span>
                </div>
              ))}
            </div>
            {weekDates.map((d, di) => {
              const dayAppts = getApptsByDate(d)
              return (
                <div key={di} className="border-l border-border relative">
                  {HOURS.map(h => <div key={h} className="h-[60px] border-b border-border/50" />)}
                  {dayAppts.map(appt => {
                    const startMin = timeToMin(appt.startTime) - 8 * 60
                    const duration = appt.service.duration
                    const top = (startMin / 60) * HOUR_H
                    const height = (duration / 60) * HOUR_H - 2
                    const color = appt.staff.color || '#1D9E75'
                    const bgMap: Record<string, string> = { '#1D9E75': '#E1F5EE', '#7F77DD': '#EEEDFE', '#D85A30': '#FAECE7' }
                    const bg = bgMap[color] || '#E1F5EE'
                    return (
                      <div key={appt.id} onClick={() => setSelectedAppt(appt)}
                        className="absolute left-1 right-1 rounded-md px-1.5 py-1 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                        style={{ top, height, background: bg, borderLeft: `3px solid ${color}` }}>
                        <p className="text-xs font-medium truncate" style={{ color }}>{appt.startTime}</p>
                        <p className="text-xs font-medium text-foreground truncate">{appt.client.firstName} {appt.client.lastName}</p>
                        {height > 45 && <p className="text-xs text-muted-foreground truncate">{appt.service.name}</p>}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {weekDates.map((d, i) => {
              const dayAppts = getApptsByDate(d)
              if (!dayAppts.length) return null
              return (
                <div key={i}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-sm font-medium ${isToday(d) ? 'text-teal-600' : ''}`}>
                      {DAYS_AR[d.getDay()]} {d.getDate()} {d.toLocaleDateString('fr-MA', { month: 'long' })}
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{dayAppts.length} mawa3id</span>
                  </div>
                  <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                    {dayAppts.map((appt, j) => (
                      <div key={appt.id} onClick={() => setSelectedAppt(appt)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-colors">
                        <span className="text-xs text-muted-foreground w-10">{appt.startTime}</span>
                        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: appt.staff.color }} />
                        <Avatar firstName={appt.client.firstName} lastName={appt.client.lastName} size="sm" colorIndex={j} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{appt.client.firstName} {appt.client.lastName}</p>
                          <p className="text-xs text-muted-foreground">{appt.service.name} — {appt.staff.firstName}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatDH(appt.price)}</span>
                        <StatusBadge status={appt.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedAppt && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAppt(null)}>
          <div className="bg-background border border-border rounded-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{editingId === selectedAppt.id ? 'Modifier maw3id' : 'Détails maw3id'}</h3>
              <button onClick={() => { setSelectedAppt(null); setEditingId(null) }} className="text-muted-foreground hover:text-foreground text-lg">×</button>
            </div>

            {editingId !== selectedAppt.id ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar firstName={selectedAppt.client.firstName} lastName={selectedAppt.client.lastName} size="md" colorIndex={0} />
                  <div>
                    <p className="font-medium">{selectedAppt.client.firstName} {selectedAppt.client.lastName}</p>
                    <p className="text-sm text-muted-foreground">{selectedAppt.client.phone}</p>
                  </div>
                </div>
                <div className="space-y-2.5 bg-secondary rounded-xl p-3 mb-4">
                  {[
                    { label: 'Khidma', value: selectedAppt.service.name },
                    { label: 'Coiffeur/se', value: selectedAppt.staff.firstName },
                    { label: 'Tarikh', value: selectedAppt.date },
                    { label: 'Wqet', value: `${selectedAppt.startTime} → ${selectedAppt.endTime}` },
                    { label: 'Prix', value: formatDH(selectedAppt.price) },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium">{r.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-1 border-t border-border">
                    <span className="text-muted-foreground">Statut</span>
                    <StatusBadge status={selectedAppt.status} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setEditingId(selectedAppt.id); setEditForm({ time: selectedAppt.startTime, notes: '' }) }}
                    className="py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                    Modifier
                  </button>
                  <button
                    onClick={() => selectedAppt && handleCancelAppointment(selectedAppt.id)}
                    disabled={cancelingId === selectedAppt?.id}
                    className="py-2 border border-destructive text-destructive rounded-lg text-xs hover:bg-red-50 transition-colors disabled:opacity-50">
                    {cancelingId === selectedAppt?.id ? 'Kaymsahel...' : 'Annuler'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Wqet (Time)</label>
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Notes</label>
                    <textarea
                      value={editForm.notes}
                      onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="Shi haja khassa..."
                      rows={3}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30 resize-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => setEditingId(null)}
                    className="py-2 border border-border rounded-lg text-xs font-medium hover:bg-secondary transition-colors">
                    Rja3
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={editingId === selectedAppt.id && !editForm.time}
                    className="py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                    Khazn
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
