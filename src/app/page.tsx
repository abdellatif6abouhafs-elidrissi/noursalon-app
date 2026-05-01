import Link from 'next/link'
import { CalendarDays, Users, Scissors, Bell, BarChart3, Shield } from 'lucide-react'

const FEATURES = [
  { icon: CalendarDays, title: 'Mawa3id automatiques', desc: 'Clients katrezarvi 24/7 — nta trta7.' },
  { icon: Bell, title: 'SMS w WhatsApp', desc: 'Rappels automatiques. 0% no-show.' },
  { icon: Users, title: 'Gestion clients', desc: 'Historique, notes, fidélité — koll shi f blassa wahda.' },
  { icon: Scissors, title: 'Planning coiffeurs', desc: 'Koll coiffeur 3ndo planning dyalou wadhih.' },
  { icon: BarChart3, title: 'Statistiques', desc: 'Chof dkhoul, khidmat matloba, o ktar.' },
  { icon: Shield, title: 'Sécurisé', desc: 'Data dyalek protected. HTTPS + JWT.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-sm">✂</div>
            <span className="font-serif text-lg font-medium">NourSalon</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Connexion</Link>
            <Link href="/auth/register" className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">Bda blash</Link>
          </div>
        </div>
      </nav>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium mb-6">Free 30 jours — ma kayn hta carte bancaire</div>
        <h1 className="font-serif text-5xl font-medium leading-tight mb-4 max-w-2xl mx-auto">Dber salonk<br /><span className="italic text-muted-foreground">bkhater wkhater.</span></h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">NourSalon — platform Marocaine lmendmaj dial salons. Mawa3id, clients, coiffeurs, SMS — koll shi f blassa wahda.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/auth/register" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">Bda blash 30 jours →</Link>
          <Link href="/pricing" className="px-6 py-3 border border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors">Chof l-pricing</Link>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 border border-border rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3"><Icon size={18} /></div>
              <h3 className="font-medium text-sm mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="bg-zinc-950 rounded-3xl p-14">
          <h2 className="font-serif text-4xl text-white mb-3">Hadi l-wqta dyalek.</h2>
          <p className="text-white/60 mb-8">Bda blash — ma khassk hta credit card.</p>
          <Link href="/auth/register" className="inline-block px-8 py-3.5 bg-white text-zinc-900 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">Sij3l daba →</Link>
        </div>
      </section>
    </div>
  )
}
