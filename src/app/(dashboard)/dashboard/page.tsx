'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import Avatar from '@/components/ui/Avatar'
import { formatDH } from '@/lib/utils'
import { CalendarDays, Users, TrendingUp, Clock } from 'lucide-react'
import type { Appointment } from '@/types'

// Mock data — bachri API
const MOCK_STATS = {
  todayAppointments: 8,
  todayRevenue: 1240,
  newClientsThisWeek: 3,
  pendingAppointments: 2,
}

const MOCK_APPTS: Appointment[] = [
  { id: '1', salonId: 's1', clientId: 'c1', client: { id:'c1', firstName:'Fatima', lastName:'Zahra', phone:'+212 661 234 567' }, staffId:'st1', staff:{id:'st1',firstName:'Samia',lastName:'',color:'#1D9E75'}, serviceId:'sv1', service:{id:'sv1',name:'Qssa w Sbegha',duration:90,price:220,color:'#1D9E75'}, date:'2026-04-24', startTime:'09:00', endTime:'10:30', status:'done', price:220, createdAt:'' },
  { id: '2', salonId: 's1', clientId: 'c2', client: { id:'c2', firstName:'Nadia', lastName:'Bensalem', phone:'+212 662 345 678' }, staffId:'st2', staff:{id:'st2',firstName:'Houda',lastName:'',color:'#7F77DD'}, serviceId:'sv2', service:{id:'sv2',name:'Keratin',duration:120,price:350,color:'#7F77DD'}, date:'2026-04-24', startTime:'10:30', endTime:'12:30', status:'confirmed', price:350, createdAt:'' },
  { id: '3', salonId: 's1', clientId: 'c3', client: { id:'c3', firstName:'Khadija', lastName:'Moussaoui', phone:'+212 663 456 789' }, staffId:'st1', staff:{id:'st1',firstName:'Samia',lastName:'',color:'#1D9E75'}, serviceId:'sv3', service:{id:'sv3',name:'L3roses complet',duration:120,price:600,color:'#1D9E75'}, date:'2026-04-24', startTime:'11:00', endTime:'13:00', status:'confirmed', price:600, createdAt:'' },
  { id: '4', salonId: 's1', clientId: 'c4', client: { id:'c4', firstName:'Sara', lastName:'Benali', phone:'+212 664 567 890' }, staffId:'st3', staff:{id:'st3',firstName:'Imane',lastName:'',color:'#D85A30'}, serviceId:'sv4', service:{id:'sv4',name:'Ongles gel',duration:60,price:150,color:'#D85A30'}, date:'2026-04-24', startTime:'14:00', endTime:'15:00', status:'pending', price:150, createdAt:'' },
  { id: '5', salonId: 's1', clientId: 'c5', client: { id:'c5', firstName:'Loubna', lastName:'El Fassi', phone:'+212 665 678 901' }, staffId:'st2', staff:{id:'st2',firstName:'Houda',lastName:'',color:'#7F77DD'}, serviceId:'sv5', service:{id:'sv5',name:'Balayage',duration:120,price:400,color:'#7F77DD'}, date:'2026-04-24', startTime:'15:30', endTime:'17:30', status:'pending', price:400, createdAt:'' },
  { id: '6', salonId: 's1', clientId: 'c6', client: { id:'c6', firstName:'Amina', lastName:'Mansouri', phone:'+212 666 789 012' }, staffId:'st1', staff:{id:'st1',firstName:'Samia',lastName:'',color:'#1D9E75'}, serviceId:'sv1', service:{id:'sv1',name:'Qssa basita',duration:60,price:80,color:'#1D9E75'}, date:'2026-04-24', startTime:'17:00', endTime:'18:00', status:'confirmed', price:80, createdAt:'' },
]

const TOP_SERVICES = [
  { name: 'Qssa', count: 14 },
  { name: 'Sbegha', count: 9 },
  { name: 'Keratin', count: 6 },
  { name: 'Ongles', count: 5 },
]

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <div className="flex flex-col flex-1">
      <Topbar
        title="Dashboard"
        action={{ label: 'Maw3id jdid', href: '/appointments/new' }}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Welcome banner */}
        {showWelcome && (
          <div className="flex items-center justify-between bg-teal-light border border-teal-200 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium text-teal-800">Sba7 l-kheir — NourSalon</p>
              <p className="text-xs text-teal-700 mt-0.5">8 mawa3id lyoum — nhar mzyan 💚</p>
            </div>
            <button onClick={() => setShowWelcome(false)} className="text-teal-600 hover:text-teal-800 text-lg leading-none">×</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Mawa3id lyoum" value={MOCK_STATS.todayAppointments} sub="+2 men ams" trend="up" icon={<CalendarDays size={14} />} />
          <StatCard label="Dkhoul lyoum" value={formatDH(MOCK_STATS.todayRevenue)} sub="+18% men ams" trend="up" icon={<TrendingUp size={14} />} />
          <StatCard label="Clients jdad" value={MOCK_STATS.newClientsThisWeek} sub="lisbou3 hada" trend="neutral" icon={<Users size={14} />} />
          <StatCard label="Mellalqin" value={MOCK_STATS.pendingAppointments} sub="khasshoum ta2kid" trend="down" icon={<Clock size={14} />} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-[1fr_280px] gap-6">
          {/* Appointments list */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
              <h2 className="text-sm font-medium">Mawa3id lyoum</h2>
              <a href="/appointments" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Chof kollhom →
              </a>
            </div>
            <div className="divide-y divide-border">
              {MOCK_APPTS.map((appt, i) => (
                <div key={appt.id} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
                  <span className="text-xs text-muted-foreground w-10 flex-shrink-0">{appt.startTime}</span>
                  <Avatar firstName={appt.client.firstName} lastName={appt.client.lastName} size="sm" colorIndex={i} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{appt.client.firstName} {appt.client.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{appt.service.name} — {appt.staff.firstName}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDH(appt.price)}</span>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-4">
            {/* Services chart */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border">
                <h2 className="text-sm font-medium">Khidmat lisbou3</h2>
              </div>
              <div className="p-4 space-y-3">
                {TOP_SERVICES.map(({ name, count }, i) => {
                  const colors = ['#1D9E75', '#378ADD', '#7F77DD', '#D85A30']
                  const pct = Math.round((count / 14) * 100)
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-14">{name}</span>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: colors[i] }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-5 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border">
                <h2 className="text-sm font-medium">Actions rapides</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                {[
                  { icon: '＋', label: 'Maw3id jdid', sub: 'Rezervi', href: '/appointments/new' },
                  { icon: '👤', label: 'Client jdid', sub: 'Sjel', href: '/clients' },
                  { icon: '📊', label: 'Statistiques', sub: 'Dkhoul', href: '/stats' },
                  { icon: '🗓', label: 'Calendrier', sub: 'Mawa3id', href: '/appointments' },
                ].map((a) => (
                  <a key={a.label} href={a.href} className="bg-secondary hover:bg-border rounded-lg p-3 transition-colors">
                    <span className="text-base block mb-1">{a.icon}</span>
                    <p className="text-xs font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.sub}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
