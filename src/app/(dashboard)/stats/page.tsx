'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { formatDH } from '@/lib/utils'
import { TrendingUp, TrendingDown, Users, CalendarDays, Scissors, DollarSign } from 'lucide-react'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']

const REVENUE_DATA = [
  { month: 'Jan', revenue: 8200, appts: 42 },
  { month: 'Fev', revenue: 9400, appts: 48 },
  { month: 'Mar', revenue: 11200, appts: 56 },
  { month: 'Avr', revenue: 10800, appts: 52 },
  { month: 'Mai', revenue: 13600, appts: 68 },
  { month: 'Jun', revenue: 12400, appts: 61 },
  { month: 'Jul', revenue: 14800, appts: 74 },
  { month: 'Aou', revenue: 13200, appts: 66 },
  { month: 'Sep', revenue: 15600, appts: 78 },
  { month: 'Oct', revenue: 16200, appts: 81 },
  { month: 'Nov', revenue: 14400, appts: 72 },
  { month: 'Dec', revenue: 17800, appts: 89 },
]

const TOP_SERVICES = [
  { name: 'Qssa basita', count: 89, revenue: 7120, color: '#1D9E75' },
  { name: 'Qssa w Sbegha', count: 64, revenue: 14080, color: '#378ADD' },
  { name: 'Keratin', count: 41, revenue: 14350, color: '#7F77DD' },
  { name: 'Balayage', count: 38, revenue: 15200, color: '#BA7517' },
  { name: 'L3roses complet', count: 22, revenue: 13200, color: '#D85A30' },
  { name: 'Ongles gel', count: 35, revenue: 5250, color: '#E24B4A' },
]

const STAFF_STATS = [
  { name: 'Samia', appts: 124, revenue: 28600, rating: 4.9, color: '#1D9E75' },
  { name: 'Houda', appts: 98, revenue: 24200, rating: 4.8, color: '#7F77DD' },
  { name: 'Imane', appts: 65, revenue: 11400, rating: 4.7, color: '#D85A30' },
]

const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue))

export default function StatsPage() {
  const [period, setPeriod] = useState<'month' | 'year'>('year')

  const totalRevenue = REVENUE_DATA.reduce((s, d) => s + d.revenue, 0)
  const totalAppts = REVENUE_DATA.reduce((s, d) => s + d.appts, 0)
  const avgPerAppt = Math.round(totalRevenue / totalAppts)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar title="Statistiques" subtitle="Vue globale dial salonk" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Period toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">2026 — Koll l-lam</h2>
          <div className="flex bg-secondary rounded-lg p-0.5">
            <button onClick={() => setPeriod('month')} className={`px-3 py-1.5 rounded-md text-xs transition-all ${period === 'month' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>Shhar</button>
            <button onClick={() => setPeriod('year')} className={`px-3 py-1.5 rounded-md text-xs transition-all ${period === 'year' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>Sana</button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Dkhoul total', value: formatDH(totalRevenue), sub: '+18% vs l3am lli fat', trend: 'up', icon: TrendingUp, color: 'text-teal-600' },
            { label: 'Mawa3id total', value: totalAppts, sub: '+24% vs l3am lli fat', trend: 'up', icon: CalendarDays, color: 'text-blue-600' },
            { label: 'Moy. / maw3id', value: formatDH(avgPerAppt), sub: '+6% vs l3am lli fat', trend: 'up', icon: DollarSign, color: 'text-violet-600' },
            { label: 'Clients jdad', value: 148, sub: '+31% vs l3am lli fat', trend: 'up', icon: Users, color: 'text-amber-600' },
          ].map(({ label, value, sub, trend, icon: Icon, color }) => (
            <div key={label} className="bg-secondary rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                <Icon size={14} className={color} />
              </div>
              <p className="text-2xl font-medium">{value}</p>
              <div className={`flex items-center gap-1 mt-1.5 text-xs ${trend === 'up' ? 'text-teal-600' : 'text-destructive'}`}>
                {trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="border border-border rounded-xl p-5">
          <h3 className="text-sm font-medium mb-5">Dkhoul — koll shhar</h3>
          <div className="flex items-end gap-2 h-48">
            {REVENUE_DATA.map((d, i) => {
              const pct = (d.revenue / maxRevenue) * 100
              const isCurrentMonth = i === 4 // Mai
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="w-full relative flex flex-col justify-end" style={{ height: '160px' }}>
                    <div
                      className="w-full rounded-t-md transition-all cursor-pointer"
                      style={{
                        height: `${pct}%`,
                        background: isCurrentMonth ? '#0a0a0a' : '#E5E5E3',
                      }}
                      title={`${d.month}: ${formatDH(d.revenue)}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm">
              <span className="text-muted-foreground">Meilleur mois: </span>
              <span className="font-medium">Décembre — {formatDH(17800)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Moyenne/mois: </span>
              <span className="font-medium">{formatDH(Math.round(totalRevenue / 12))}</span>
            </div>
          </div>
        </div>

        {/* Services + Staff grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top services */}
          <div className="border border-border rounded-xl p-5">
            <h3 className="text-sm font-medium mb-4">Khidmat matloba</h3>
            <div className="space-y-3">
              {TOP_SERVICES.map((s, i) => {
                const maxCount = TOP_SERVICES[0].count
                const pct = Math.round((s.count / maxCount) * 100)
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="text-sm">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{s.count} fois</span>
                        <span className="font-medium text-foreground">{formatDH(s.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Staff performance */}
          <div className="border border-border rounded-xl p-5">
            <h3 className="text-sm font-medium mb-4">Performance coiffeurs</h3>
            <div className="space-y-4">
              {STAFF_STATS.map((s) => (
                <div key={s.name} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0" style={{ background: s.color }}>
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{s.name}</p>
                      <span className="text-xs text-amber-500">⭐ {s.rating}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{s.appts} mawa3id</span>
                      <span className="text-teal-600 font-medium">{formatDH(s.revenue)}</span>
                    </div>
                    <div className="h-1 bg-border rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(s.appts / 124) * 100}%`, background: s.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
              <span className="text-muted-foreground">Total équipe</span>
              <span className="font-medium">{formatDH(STAFF_STATS.reduce((s, st) => s + st.revenue, 0))}</span>
            </div>
          </div>
        </div>

        {/* Monthly breakdown table */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-medium">Détail par mois</h3>
          </div>
          <div className="divide-y divide-border">
            <div className="grid grid-cols-4 px-5 py-2 bg-secondary">
              {['Shhar', 'Mawa3id', 'Dkhoul', 'Moy/maw3id'].map(h => (
                <span key={h} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</span>
              ))}
            </div>
            {REVENUE_DATA.map((d, i) => (
              <div key={d.month} className={`grid grid-cols-4 px-5 py-3 hover:bg-secondary/50 transition-colors ${i === 4 ? 'bg-teal-50/50' : ''}`}>
                <span className={`text-sm font-medium ${i === 4 ? 'text-teal-700' : ''}`}>{d.month} 2026</span>
                <span className="text-sm">{d.appts}</span>
                <span className="text-sm font-medium">{formatDH(d.revenue)}</span>
                <span className="text-sm text-muted-foreground">{formatDH(Math.round(d.revenue / d.appts))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
