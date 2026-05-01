import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

const COLORS = [
  { bg: 'bg-teal-50', text: 'text-teal-700' },
  { bg: 'bg-violet-50', text: 'text-violet-700' },
  { bg: 'bg-orange-50', text: 'text-orange-700' },
  { bg: 'bg-blue-50', text: 'text-blue-700' },
  { bg: 'bg-amber-50', text: 'text-amber-700' },
]

interface AvatarProps {
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg'
  colorIndex?: number
  className?: string
}

export default function Avatar({ firstName, lastName, size = 'md', colorIndex = 0, className }: AvatarProps) {
  const color = COLORS[colorIndex % COLORS.length]
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-medium flex-shrink-0',
      color.bg, color.text, sizes[size], className
    )}>
      {getInitials(firstName, lastName)}
    </div>
  )
}
