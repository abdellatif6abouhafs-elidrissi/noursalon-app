import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/types'

const CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: { label: 'Mta2kad', className: 'bg-teal-light text-teal-700' },
  pending:   { label: 'Mellalq', className: 'bg-amber-50 text-amber-700' },
  done:      { label: 'Kamal',   className: 'bg-secondary text-muted-foreground' },
  cancelled: { label: 'Mlgh',    className: 'bg-red-50 text-red-700' },
  no_show:   { label: 'Ma jach', className: 'bg-red-50 text-red-600' },
}

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { label, className } = CONFIG[status] ?? CONFIG.pending
  return (
    <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-medium', className)}>
      {label}
    </span>
  )
}
