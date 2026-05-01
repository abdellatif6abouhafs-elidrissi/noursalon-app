'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Save, Plus, Trash2, Bell, Clock, CreditCard, Palette } from 'lucide-react'

const TABS = [
  { id: 'salon', label: 'Salon', icon: Palette },
  { id: 'services', label: 'Khidmat', icon: Clock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'plan', label: 'Plan', icon: CreditCard },
]

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda']

const MOCK_SERVICES = [
  { id: '1', name: 'Qssa basita', duration: 60, price: 80, color: '#1D9E75' },
  { id: '2', name: 'Qssa w Sbegha', duration: 90, price: 220, color: '#378ADD' },
  { id: '3', name: 'Keratin', duration: 120, price: 350, color: '#7F77DD' },
  { id: '4', name: 'Balayage', duration: 150, price: 400, color: '#D85A30' },
  { id: '5', name: "L3roses complet", duration: 180, price: 600, color: '#BA7517' },
  { id: '6', name: 'Ongles gel', duration: 60, price: 150, color: '#D85A30' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('salon')
  const [saved, setSaved] = useState(false)
  const [services, setServices] = useState(MOCK_SERVICES)
  const [salonForm, setSalonForm] = useState({
    name: 'NourSalon', phone: '+212 661 000 000',
    email: 'contact@noursalon.ma', city: 'Casablanca',
    address: 'Bd Hassan II, Casablanca',
    openTime: '09:00', closeTime: '20:00',
  })
  const [notifs, setNotifs] = useState({
    smsConfirm: true, smsReminder: true, smsCancel: true,
    reminderHours: '24', whatsapp: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col flex-1">
      <Topbar
        title="Paramètres"
        subtitle="Gestion dial salon dyalek"
        action={{ label: saved ? 'Sauvegardé ✓' : 'Sauvegarder', onClick: handleSave }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Tabs sidebar */}
        <div className="w-52 border-r border-border p-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${tab === id ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* SALON */}
          {tab === 'salon' && (
            <div className="max-w-xl space-y-5">
              <h2 className="text-sm font-medium mb-4">Info salon</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Smiya d-salon', key: 'name', placeholder: 'NourSalon' },
                  { label: 'Téléphone', key: 'phone', placeholder: '+212...' },
                  { label: 'Email', key: 'email', placeholder: 'contact@...' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">{f.label}</label>
                    <input
                      value={salonForm[f.key as keyof typeof salonForm]}
                      onChange={e => setSalonForm({ ...salonForm, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Ville</label>
                  <select
                    value={salonForm.city}
                    onChange={e => setSalonForm({ ...salonForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
                  >
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Adresse</label>
                <input
                  value={salonForm.address}
                  onChange={e => setSalonForm({ ...salonForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Ftouh</label>
                  <input type="time" value={salonForm.openTime} onChange={e => setSalonForm({ ...salonForm, openTime: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Ghlaq</label>
                  <input type="time" value={salonForm.closeTime} onChange={e => setSalonForm({ ...salonForm, closeTime: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* SERVICES */}
          {tab === 'services' && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-medium">Khidmat (services)</h2>
                <button className="flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-2 hover:bg-secondary transition-colors">
                  <Plus size={13} /> Zid khidma
                </button>
              </div>
              <div className="space-y-2">
                {services.map(sv => (
                  <div key={sv.id} className="flex items-center gap-4 p-3.5 border border-border rounded-xl hover:bg-secondary/30 transition-colors group">
                    <div className="w-3 h-8 rounded-full flex-shrink-0" style={{ background: sv.color }} />
                    <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                      <input
                        value={sv.name}
                        onChange={e => setServices(services.map(s => s.id === sv.id ? { ...s, name: e.target.value } : s))}
                        className="text-sm font-medium bg-transparent border-b border-transparent hover:border-border focus:border-foreground/30 focus:outline-none py-0.5"
                      />
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock size={12} />
                        <input
                          type="number"
                          value={sv.duration}
                          onChange={e => setServices(services.map(s => s.id === sv.id ? { ...s, duration: +e.target.value } : s))}
                          className="w-14 bg-transparent border-b border-transparent hover:border-border focus:border-foreground/30 focus:outline-none text-foreground"
                        />
                        <span>min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <input
                          type="number"
                          value={sv.price}
                          onChange={e => setServices(services.map(s => s.id === sv.id ? { ...s, price: +e.target.value } : s))}
                          className="w-16 bg-transparent border-b border-transparent hover:border-border focus:border-foreground/30 focus:outline-none font-medium"
                        />
                        <span className="text-muted-foreground">DH</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setServices(services.filter(s => s.id !== sv.id))}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === 'notifications' && (
            <div className="max-w-xl space-y-6">
              <h2 className="text-sm font-medium">Notifications SMS / WhatsApp</h2>
              <div className="space-y-3">
                {[
                  { key: 'smsConfirm', label: 'SMS confirmation maw3id', sub: 'Ktsa3at l-client waqt ma ytconfirm maw3id' },
                  { key: 'smsReminder', label: 'SMS rappel qbel maw3id', sub: 'Rappel automatique qbel X sa3at' },
                  { key: 'smsCancel', label: 'SMS annulation', sub: 'Ktsa3at waqt l-annulation' },
                  { key: 'whatsapp', label: 'WhatsApp (beta)', sub: 'Bda3 messages via WhatsApp Business' },
                ].map(n => (
                  <div key={n.key} className="flex items-start justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="text-sm font-medium">{n.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.sub}</p>
                    </div>
                    <button
                      onClick={() => setNotifs({ ...notifs, [n.key]: !notifs[n.key as keyof typeof notifs] })}
                      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${notifs[n.key as keyof typeof notifs] ? 'bg-teal-600' : 'bg-border'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${notifs[n.key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Rappel qbel (sa3at)</label>
                <select value={notifs.reminderHours} onChange={e => setNotifs({ ...notifs, reminderHours: e.target.value })} className="px-3 py-2 border border-border rounded-lg text-sm bg-background">
                  {['1', '2', '3', '6', '12', '24', '48'].map(h => <option key={h} value={h}>{h} sa3a qbel</option>)}
                </select>
              </div>
            </div>
          )}

          {/* PLAN */}
          {tab === 'plan' && (
            <div className="max-w-2xl">
              <h2 className="text-sm font-medium mb-5">Plan dyalek</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Free', price: 0, features: ['5 mawa3id/jour', '1 coiffeur', 'SMS: 20/shahr', 'Support email'], current: false, color: 'border-border' },
                  { name: 'Pro', price: 99, features: ['Mawa3id unlimited', 'Coiffeurs unlimited', 'SMS unlimited', 'WhatsApp notifs', 'Statistiques avancées', 'Support prioritaire'], current: true, color: 'border-foreground' },
                ].map(plan => (
                  <div key={plan.name} className={`border-2 ${plan.color} rounded-2xl p-5 ${plan.current ? 'shadow-sm' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-serif text-lg font-medium">{plan.name}</h3>
                        <p className="text-2xl font-medium mt-1">{plan.price === 0 ? 'Blash' : `${plan.price} DH`} <span className="text-sm font-normal text-muted-foreground">{plan.price > 0 ? '/shahr' : ''}</span></p>
                      </div>
                      {plan.current && <span className="text-xs px-2.5 py-1 bg-teal-light text-teal-700 rounded-full font-medium">Plan dyalek</span>}
                    </div>
                    <ul className="space-y-2 mb-5">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-teal-600">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-2.5 rounded-xl text-sm font-medium transition-opacity ${plan.current ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-secondary'}`}>
                      {plan.current ? 'Plan actuel' : 'Passer au Free'}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">Pro plan dyalek kaytejdded automatiquement. Tkhedder annuler f n importe wqet.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
