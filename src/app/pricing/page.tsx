import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: 0,
    desc: 'Pour commencer — blash',
    features: [
      '5 mawa3id f nhar',
      '1 coiffeur',
      '20 SMS f shhar',
      'Dashboard basit',
      'Support email',
    ],
    notIncluded: ['Mawa3id unlimited', 'Coiffeurs unlimited', 'WhatsApp notifs', 'Statistiques avancées'],
    cta: 'Bda blash',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 99,
    desc: 'Pour salons actifs',
    features: [
      'Mawa3id unlimited',
      'Coiffeurs unlimited',
      'SMS + WhatsApp unlimited',
      'Dashboard complet',
      'Statistiques avancées',
      'Rappels automatiques',
      'Export CSV/Excel',
      'Support prioritaire',
    ],
    notIncluded: [],
    cta: 'Bda 30 jours blash',
    href: '/auth/register?plan=pro',
    highlight: true,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-sm">✂</div>
            <span className="font-serif text-lg font-medium">NourSalon</span>
          </Link>
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Connexion</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-medium mb-3">Pricing wadhih — ma kayn l-khbaya</h1>
        <p className="text-muted-foreground mb-12">Bda blash — upgrade wqt ma tji.</p>

        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`border rounded-2xl p-6 text-left ${plan.highlight ? 'border-2 border-zinc-900 shadow-lg' : 'border-border'}`}>
              {plan.highlight && (
                <div className="text-xs font-medium px-2.5 py-1 bg-zinc-900 text-white rounded-full inline-block mb-4">
                  L-ktar popular
                </div>
              )}
              <h2 className="font-serif text-2xl font-medium">{plan.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">{plan.desc}</p>
              <p className="text-3xl font-medium mb-1">
                {plan.price === 0 ? 'Blash' : `${plan.price} DH`}
              </p>
              {plan.price > 0 && <p className="text-sm text-muted-foreground mb-6">/shahr — annuler wqt ma bghiti</p>}
              {plan.price === 0 && <p className="text-sm text-muted-foreground mb-6">Pour toujours</p>}

              <Link
                href={plan.href}
                className={`block w-full py-2.5 rounded-xl text-sm font-medium text-center mb-6 transition-opacity hover:opacity-90 ${plan.highlight ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-secondary'}`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-2.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className="text-emerald-600 font-medium">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground/50">
                    <span>—</span>
                    <span className="line-through">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-10">
          Wach 3ndak su2al? <a href="mailto:contact@noursalon.ma" className="text-foreground underline underline-offset-2">kteb lina</a>
        </p>
      </div>
    </div>
  )
}
