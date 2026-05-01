'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import type { RegisterFormData, UserRole } from '@/types'

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Laâyoune','Autre']
const ROLES: { value: UserRole; label: string }[] = [
  { value: 'owner', label: 'Patron/ne' },
  { value: 'manager', label: 'Manager' },
  { value: 'stylist', label: 'Coiffeur/se' },
]

function strength(p: string) {
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[!@#$%]/.test(p)) s++
  const colors = ['#ef4444','#ef4444','#f59e0b','#10b981','#10b981']
  const labels = ['','D3if','Meqboul','Mzyan','Qwi']
  return { pct: s * 25, color: colors[s], label: labels[s] }
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<RegisterFormData>({ firstName:'', lastName:'', salonName:'', phone:'', email:'', password:'', city:'Casablanca', role:'owner' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pw = strength(form.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authService.register(form)
      authService.saveSession(res)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Khta f inscription')
    } finally {
      setLoading(false)
    }
  }

  const u = (k: keyof RegisterFormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">✂</div>
          <span className="text-white font-serif text-xl">NourSalon</span>
        </div>
        <div>
          <h2 className="text-white font-serif text-4xl leading-tight mb-8">Bda m3ana<br /><em className="text-white/40">lyoum blash.</em></h2>
          <div className="space-y-3">
            {['Mawa3id automatiques 24/7','SMS + WhatsApp notifications','Dashboard + statistiques complet','Free 30 jours — ma kayn hta carte'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-xs flex-shrink-0">✓</div>
                <span className="text-white/60 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-sm py-6">
          <h1 className="font-serif text-2xl mb-1">Compte jdid</h1>
          <p className="text-sm text-muted-foreground mb-6">Sij3l w bda tdber salonk</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Nta...</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => u('role', r.value)}
                    className={`py-2 rounded-lg text-xs border transition-all ${form.role === r.value ? 'bg-primary text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Isem</label>
                <input type="text" placeholder="Fatima" value={form.firstName} onChange={e => u('firstName', e.target.value)} required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Lqab</label>
                <input type="text" placeholder="Benali" value={form.lastName} onChange={e => u('lastName', e.target.value)} required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/40" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Smiya d-salon</label>
              <input type="text" placeholder="Salon Nour" value={form.salonName} onChange={e => u('salonName', e.target.value)} required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/40" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Tel / WhatsApp</label>
              <input type="tel" placeholder="+212 6XX XXX XXX" value={form.phone} onChange={e => u('phone', e.target.value)} required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/40" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Email</label>
              <input type="email" placeholder="salon@example.ma" value={form.email} onChange={e => u('email', e.target.value)} required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/40" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 caractères" value={form.password} onChange={e => u('password', e.target.value)} required minLength={8}
                  className="w-full px-3 py-2.5 pr-14 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/40" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground">
                  {showPass ? 'Khbbi' : 'Wri'}
                </button>
              </div>
              {form.password && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pw.pct}%`, background: pw.color }} />
                  </div>
                  <span className="text-xs" style={{ color: pw.color }}>{pw.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Ville</label>
              <select value={form.city} onChange={e => u('city', e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/40">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
              {loading ? 'Kansij3l...' : 'Sij3l w bda'}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              B-sij3lek katqbal <Link href="/terms" className="text-foreground">CGU</Link> w <Link href="/privacy" className="text-foreground">Confidentialité</Link>
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            3ndak compte? <Link href="/auth/login" className="text-foreground font-medium">Dkhol</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
