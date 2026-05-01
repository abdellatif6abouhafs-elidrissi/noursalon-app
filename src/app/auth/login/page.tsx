'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import type { LoginFormData } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState<LoginFormData>({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authService.login(form)
      authService.saveSession(res)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Email aw password khate2')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">✂</div>
          <span className="text-white font-serif text-xl">NourSalon</span>
        </div>
        <div>
          <h2 className="text-white font-serif text-4xl leading-tight mb-8">Dber salonk<br /><em className="text-white/40">bkhater wkhater.</em></h2>
          <div className="grid grid-cols-2 gap-3">
            {[['2,400+','Salons actifs'],['98%','Clients radhyin'],['45k+','Mawa3id/shahr'],['4.9 ★','Note moyenne']].map(([v,l]) => (
              <div key={l} className="bg-white/5 rounded-xl p-4">
                <div className="text-white text-2xl font-medium">{v}</div>
                <div className="text-white/40 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-2xl mb-1">Merhba bik</h1>
          <p className="text-sm text-muted-foreground mb-8">Dkhol l-compte dyalek</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Email</label>
              <input type="email" placeholder="salon@example.ma" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/40 transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
                  className="w-full px-3 py-2.5 pr-14 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground/40 transition-colors" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground">
                  {showPass ? 'Khbbi' : 'Wri'}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Nsiti l-mot de passe?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
              {loading ? 'Kandkhol...' : 'Dkhol'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Ma3ndakch compte?{' '}
            <Link href="/auth/register" className="text-foreground font-medium">Sij3l daba</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
