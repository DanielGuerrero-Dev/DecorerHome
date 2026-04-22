import { Loader2 } from 'lucide-react'

export const Spinner = ({ size = 24, className = "" }: { size?: number, className?: string }) => {
  return <Loader2 size={size} className={`animate-spin text-[var(--accent-from)] ${className}`} />
}
