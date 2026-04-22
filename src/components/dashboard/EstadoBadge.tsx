import { EstadoCuenta } from '@prisma/client'

export const EstadoBadge = ({ estado }: { estado: EstadoCuenta }) => {
  const labels: Record<EstadoCuenta, string> = {
    AL_DIA: 'Al día',
    EN_RIESGO: 'En riesgo',
    VENCIDO: 'Vencido',
    CRITICO: 'Crítico'
  }
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium status-${estado} border border-current/10`}>
      {labels[estado]}
    </span>
  )
}
