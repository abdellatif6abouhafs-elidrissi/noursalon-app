'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Avatar from '@/components/ui/Avatar'
import { formatDH } from '@/lib/utils'
import { Phone, Scissors, Calendar, TrendingUp, Plus, Edit2 } from 'lucide-react'
import type { StaffMember } from '@/types'

const DAYS = ['Ahad', 'Ithnayn', 'Thla', 'Arb3a', 'Khamis', 'Jma3a', 'Sebt']

const MOCK_STAFF: (StaffMember & { revenue: number; rating: number })[] = [
  { id:'st1', salonId:'s1', firstName:'Samia', lastName:'Bennani', phone:'+212 671 111 222', color:'#1D9E75', specialties:['Qssa', 'Sbegha', 'L3roses'], workingDays:[1,2,3,4,5,6], active:true, appointmentsCount:3, createdAt:'2025-01-01', role:'stylist', revenue:4800, rating:4.9 },
  { id:'st2', salonId:'s1', firstName:'Houda', lastName:'Chraibi', phone:'+212 671 333 444', color:'#7F77DD', specialties:['Keratin', 'Balayage', 'Soin'], workingDays:[1,2,3,4,5], active:true, appointmentsCount:2, createdAt:'2025-03-15', role:'stylist', revenue:3600, rating:4.8 },
  { id:'st3', salonId:'s1', firstName:'Imane', lastName:'Tazi', phone:'+212 671 555 666', color:'#D85A30', specialties:['Ongles', 'Manucure'], workingDays:[2,3,4,5,6], active:true, appointmentsCount:1, createdAt:'2025-06-20', role:'stylist', revenue:1800, rating:4.7 },
]

const SERVICES_ALL = ['Qssa', 'Sbegha', 'Keratin', 'Balayage', 'L3roses', 'Ongles', 'Soin', 'Manucure']

export default function StaffPage() {
  const [selected, setSelected] = useState<typeof MOCK_STAFF[0] | null>(MOCK_STAFF[0])

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Coiffeurs" subtitle={`${MOCK_STAFF.length} coiffeurs actifs`} action={{ label: 'Coiffeur jdid', href: '/staff/new' }} />

      <div className="flex flex-1 overflow-hidden">
        {/* Cards list */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            {MOCK_STAFF.map((s, i) => (
              <div
                key={s.id}
                onClick={() => setSelected(s)}
                className={`border rounded-xl p-5 cursor-pointer transition-all ${selected?.id === s.id ? 'border-foreground/30 shadow-sm' : 'border-border hover:border-foreground/20'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0" style={{ background: s.color }}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-muted-foreground">⭐ {s.rating}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-light text-teal-700">Actif</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-secondary rounded-lg p-2.5">
                    <p className="text-xs text-muted-foreground mb-0.5">Lyoum</p>
                    <p className="text-lg font-medium">{s.appointmentsCount}</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-2.5">
                    <p className="text-xs text-muted-foreground mb-0.5">Shhar</p>
                    <p className="text-sm font-medium text-teal-600">{formatDH(s.revenue)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {s.specialties.map(sp => (
                    <span key={sp} className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{sp}</span>
                  ))}
                </div>

                {/* Working days */}
                <div className="flex gap-1 mt-3">
                  {DAYS.map((d, di) => (
                    <div key={d} className={`w-7 h-6 rounded text-xs flex items-center justify-center font-medium ${s.workingDays.includes(di) ? 'text-white' : 'bg-secondary text-muted-foreground/40'}`}
                      style={s.workingDays.includes(di) ? { background: s.color } : {}}>
                      {d[0]}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add card */}
            <div className="border border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors min-h-[200px]">
              <div className="w-10 h-10 rounded-full border border-dashed border-border flex items-center justify-center">
                <Plus size={16} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Zid coiffeur jdid</p>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 border-l border-border flex flex-col overflow-y-auto">
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Détails</h3>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1.5 transition-colors">
                  <Edit2 size={11} /> Modifier
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-medium text-lg" style={{ background: selected.color }}>
                  {selected.firstName[0]}{selected.lastName[0]}
                </div>
                <div>
                  <p className="font-medium">{selected.firstName} {selected.lastName}</p>
                  <p className="text-sm text-muted-foreground">⭐ {selected.rating} — Coiffeur/se</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Mawa3id lishhar</p>
                  <p className="text-xl font-medium">47</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Dkhoul</p>
                  <p className="text-sm font-medium text-teal-600">{formatDH(selected.revenue)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Contact</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={13} className="text-muted-foreground" />
                  {selected.phone}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Spécialités</p>
                <div className="flex flex-wrap gap-1.5">
                  {SERVICES_ALL.map(sv => (
                    <span key={sv} className={`text-xs px-2.5 py-1 rounded-full transition-colors ${selected.specialties.includes(sv) ? 'text-white' : 'bg-secondary text-muted-foreground'}`}
                      style={selected.specialties.includes(sv) ? { background: selected.color } : {}}>
                      {sv}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Jours de travail</p>
                <div className="flex gap-1.5">
                  {DAYS.map((d, di) => (
                    <div key={d} className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center font-medium ${selected.workingDays.includes(di) ? 'text-white' : 'bg-secondary text-muted-foreground/40'}`}
                      style={selected.workingDays.includes(di) ? { background: selected.color } : {}}>
                      {d[0]}
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                Chof planning dyalha
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
