'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import Avatar from '@/components/ui/Avatar'
import { Search, Check, ChevronLeft } from 'lucide-react'

const MOCK_CLIENTS = [
  { id:'c1', firstName:'Fatima', lastName:'Zahra', phone:'+212 661 234 567' },
  { id:'c2', firstName:'Nadia', lastName:'Bensalem', phone:'+212 662 345 678' },
  { id:'c3', firstName:'Khadija', lastName:'Moussaoui', phone:'+212 663 456 789' },
  { id:'c4', firstName:'Sara', lastName:'Benali', phone:'+212 664 567 890' },
  { id:'c5', firstName:'Loubna', lastName:'El Fassi', phone:'+212 665 678 901' },
  { id:'c6', firstName:'Amina', lastName:'Mansouri', phone:'+212 666 789 012' },
]

const MOCK_STAFF = [
  { id:'st1', firstName:'Samia', lastName:'', color:'#1D9E75', specialties:['Qssa','Sbegha','L3roses'] },
  { id:'st2', firstName:'Houda', lastName:'', color:'#7F77DD', specialties:['Keratin','Balayage','Soin'] },
  { id:'st3', firstName:'Imane', lastName:'', color:'#D85A30', specialties:['Ongles','Manucure'] },
]

const MOCK_SERVICES = [
  { id:'sv1', name:'Qssa basita', duration:60, price:80 },
  { id:'sv2', name:'Qssa w Sbegha', duration:90, price:220 },
  { id:'sv3', name:'Keratin', duration:120, price:350 },
  { id:'sv4', name:'Balayage', duration:150, price:400 },
  { id:'sv5', name:"L3roses complet", duration:180, price:600 },
  { id:'sv6', name:'Ongles gel', duration:60, price:150 },
  { id:'sv7', name:'Soin cheveux', duration:60, price:180 },
]

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00']
const TAKEN_SLOTS = ['09:00','10:30','11:00']

type Step = 1 | 2 | 3 | 4

export default function NewAppointmentPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [selectedClient, setSelectedClient] = useState<typeof MOCK_CLIENTS[0] | null>(null)
  const [selectedService, setSelectedService] = useState<typeof MOCK_SERVICES[0] | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<typeof MOCK_STAFF[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')

  const filteredClients = MOCK_CLIENTS.filter(c =>
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  const canNext = () => {
    if (step === 1) return !!selectedClient
    if (step === 2) return !!selectedService && !!selectedStaff
    if (step === 3) return !!selectedDate && !!selectedTime
    return true
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const appointmentData = {
        clientId: selectedClient?.id,
        clientName: `${selectedClient?.firstName} ${selectedClient?.lastName}`,
        serviceId: selectedService?.id,
        serviceName: selectedService?.name,
        staffId: selectedStaff?.id,
        staffName: selectedStaff?.firstName,
        date: selectedDate,
        time: selectedTime,
        notes,
        price: selectedService?.price,
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg = errorData.detail || `HTTP ${response.status}`
        throw new Error(errorMsg)
      }

      setLoading(false)
      setSuccess(true)
      setTimeout(() => router.push('/appointments'), 2000)
    } catch (error) {
      console.error('Error creating appointment:', error)
      setLoading(false)
      alert(`Failed to create appointment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const STEPS = ['Client', 'Service', 'Date & Wqet', 'Confirm']

  if (success) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-4">
          <Check size={28} className="text-teal-600" />
        </div>
        <h2 className="text-xl font-serif font-medium mb-2">Maw3id mta2kad!</h2>
        <p className="text-muted-foreground text-sm mb-1">{selectedClient?.firstName} {selectedClient?.lastName}</p>
        <p className="text-muted-foreground text-sm">{selectedService?.name} — {selectedTime} — {selectedDate}</p>
        <p className="text-xs text-muted-foreground mt-4">Kanrja3 l-mawa3id...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar title="Maw3id jdid" subtitle="Rezervi maw3id jdid" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">

          {/* Stepper */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    step > i + 1 ? 'bg-teal-600 text-white' :
                    step === i + 1 ? 'bg-primary text-primary-foreground' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {step > i + 1 ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 ${step === i + 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 mb-4 transition-all ${step > i + 1 ? 'bg-teal-600' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1 — Client */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium">Akhtari client</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Kteb isem aw telephone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
                />
              </div>
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {filteredClients.map((c, i) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClient(c)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedClient?.id === c.id ? 'bg-teal-50' : 'hover:bg-secondary/50'}`}
                  >
                    <Avatar firstName={c.firstName} lastName={c.lastName} size="sm" colorIndex={i} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-muted-foreground">{c.phone}</p>
                    </div>
                    {selectedClient?.id === c.id && <Check size={16} className="text-teal-600" />}
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/clients/new')}
                className="w-full py-2.5 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors"
              >
                + Zid client jdid
              </button>
            </div>
          )}

          {/* Step 2 — Service + Staff */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-medium mb-3">Akhtari khidma</h3>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_SERVICES.map(sv => (
                    <div
                      key={sv.id}
                      onClick={() => setSelectedService(sv)}
                      className={`p-3.5 border rounded-xl cursor-pointer transition-all ${selectedService?.id === sv.id ? 'border-primary bg-secondary' : 'border-border hover:border-foreground/20'}`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium">{sv.name}</p>
                        {selectedService?.id === sv.id && <Check size={14} className="text-teal-600 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{sv.duration} min</span>
                        <span className="text-xs font-medium text-teal-600">{sv.price} DH</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Akhtari coiffeur/se</h3>
                <div className="grid grid-cols-3 gap-3">
                  {MOCK_STAFF.map(st => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStaff(st)}
                      className={`p-4 border rounded-xl cursor-pointer text-center transition-all ${selectedStaff?.id === st.id ? 'border-2 border-primary' : 'border-border hover:border-foreground/20'}`}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mx-auto mb-2" style={{ background: st.color }}>
                        {st.firstName[0]}
                      </div>
                      <p className="text-sm font-medium">{st.firstName}</p>
                      <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                        {st.specialties.slice(0, 2).map(sp => (
                          <span key={sp} className="text-xs text-muted-foreground">{sp}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Date + Time */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-medium mb-3">Akhtari tarikh</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Akhtari wqet</h3>
                <div className="grid grid-cols-5 gap-2">
                  {TIME_SLOTS.map(t => {
                    const taken = TAKEN_SLOTS.includes(t)
                    const selected = selectedTime === t
                    return (
                      <button
                        key={t}
                        disabled={taken}
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 rounded-lg text-sm border transition-all ${
                          taken ? 'bg-secondary text-muted-foreground/40 line-through cursor-not-allowed border-transparent' :
                          selected ? 'bg-primary text-primary-foreground border-transparent' :
                          'border-border hover:border-foreground/30'
                        }`}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Notes (ikhtiari)</h3>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Shi haja khassa..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 4 — Confirm */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-medium">Confirm maw3id</h3>
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Avatar firstName={selectedClient!.firstName} lastName={selectedClient!.lastName} size="md" colorIndex={0} />
                  <div>
                    <p className="font-medium">{selectedClient?.firstName} {selectedClient?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{selectedClient?.phone}</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { label: 'Khidma', value: selectedService?.name },
                    { label: 'Durée', value: `${selectedService?.duration} min` },
                    { label: 'Coiffeur/se', value: selectedStaff?.firstName },
                    { label: 'Tarikh', value: selectedDate },
                    { label: 'Wqet', value: selectedTime },
                    { label: 'Notes', value: notes || '—' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium">{r.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-3 border-t border-border">
                    <span className="text-muted-foreground">Prix</span>
                    <span className="text-lg font-medium text-teal-600">{selectedService?.price} DH</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={14} /> Rja3
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep((step + 1) as Step)}
                disabled={!canNext()}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                Mchi l-{STEPS[step]} →
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-70 transition-opacity"
              >
                {loading ? 'Kandiru...' : 'Confirm maw3id ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
