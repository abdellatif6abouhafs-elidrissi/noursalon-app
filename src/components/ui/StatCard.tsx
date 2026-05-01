import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
}

export default function StatCard({ label, value, sub, trend, icon }: StatCardProps) {
  return (
    <div className="bg-secondary rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="text-2xl font-medium text-foreground">{value}</p>
      {sub && (
        <div className={cn('flex items-center gap-1 mt-1.5 text-xs',
          trend === 'up' && 'text-teal-600',
          trend === 'down' && 'text-destructive',
          trend === 'neutral' && 'text-muted-foreground',
          !trend && 'text-muted-foreground'
        )}>
          {trend === 'up' && <TrendingUp size={11} />}
          {trend === 'down' && <TrendingDown size={11} />}
          {trend === 'neutral' && <Minus size={11} />}
          {sub}
        </div>
      )}
    </div>
  )
}
