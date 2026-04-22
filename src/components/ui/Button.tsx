import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost' | 'glass'
  isLoading?: boolean
  icon?: React.ReactNode
}

const variants = {
  primary: 'bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] border-transparent',
  outline: 'bg-transparent border-[var(--border)] text-[var(--text-primary)] hover:bg-white/5 border',
  danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
  ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-white/5',
  glass: 'glass text-[var(--text-primary)] hover:bg-white/10'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={`flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={18} />}
        {!isLoading && icon}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
