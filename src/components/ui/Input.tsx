import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, id, ...props }, ref) => {
    const defaultId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={defaultId} className="text-sm font-medium text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={defaultId}
            className={`w-full bg-[var(--bg-base)] border text-[var(--text-primary)] rounded-lg py-2.5 outline-none transition-all
              ${icon ? 'pl-10' : 'pl-4'} pr-4
              ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[var(--border)] focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)]'}
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
