import { ReactNode } from "react"

interface KPICardProps {
  title: string
  value: string | number
  icon: ReactNode
  subtitle?: string
  danger?: boolean
}

export const KPICard = ({ title, value, icon, subtitle, danger }: KPICardProps) => {
  return (
    <div className="glass p-6 rounded-2xl flex flex-col justify-between border-[var(--border)] relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-colors ${danger ? 'bg-red-500' : 'bg-[var(--accent-from)]'}`} />
      
      <div className="flex justify-between items-start mb-4">
        <p className="text-[var(--text-muted)] font-medium text-sm">{title}</p>
        <div className={`p-2 rounded-xl border border-white/5 shadow-inner ${danger ? 'text-red-400 bg-red-400/10' : 'text-white bg-white/10'}`}>
          {icon}
        </div>
      </div>
      
      <div>
        <h3 className={`text-3xl font-heading font-bold ${danger ? 'text-red-400' : 'text-white'}`}>
          {value}
        </h3>
        {subtitle && <p className="text-xs text-[var(--text-muted)] mt-2">{subtitle}</p>}
      </div>
    </div>
  )
}
