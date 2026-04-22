import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatCOP } from "@/lib/formatCOP"
import { FileDown, PieChart } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ReportesPage() {
  const session = await auth()

  // Resumen Data
  const cuentas = await prisma.cuenta.findMany({
    select: { estado: true, saldoPendiente: true }
  })

  const totalesPorEstado = cuentas.reduce((acc, c) => {
    if (!acc[c.estado]) acc[c.estado] = 0
    acc[c.estado] += c.saldoPendiente
    return acc
  }, {} as Record<string, number>)

  const carteraTotal = cuentas.reduce((acc, c) => acc + c.saldoPendiente, 0)
  const carteraVencidaCr = (totalesPorEstado["VENCIDO"] || 0) + (totalesPorEstado["CRITICO"] || 0)

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-2">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Centro de Reportes</h1>
          <p className="text-[var(--text-muted)]">Genera e imprime el consolido de toda la cartera en un instante.</p>
        </div>
        
        {/* Usamos un tag 'a' estándar y no 'Link' para asegurar que provoque la descarga del archivo */}
        <a 
          href="/api/reportes/export"
          target="_blank"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-medium shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] transition-all shrink-0"
        >
          <FileDown size={20} />
          Descargar Informe Completo (CSV)
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-2xl border-[var(--border)] relative overflow-hidden">
          <div className="absolute -right-8 -top-8 text-white/5">
            <PieChart size={180} />
          </div>
          <p className="text-[var(--text-muted)] text-sm mb-1 uppercase tracking-wider font-semibold">Total Cartera Activa</p>
          <p className="text-4xl font-heading font-bold text-white">
            {formatCOP(carteraTotal)}
          </p>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Cartera Sana (Al día + Riesgo)</p>
              <p className="text-lg font-bold text-green-400">{formatCOP(carteraTotal - carteraVencidaCr)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Cartera en Mora</p>
              <p className="text-lg font-bold text-red-400">{formatCOP(carteraVencidaCr)}</p>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-[var(--border)]">
          <h3 className="font-heading font-semibold text-white mb-4">Desglose por Estado</h3>
          <div className="space-y-4">
            {['AL_DIA', 'EN_RIESGO', 'VENCIDO', 'CRITICO'].map(estado => {
              const val = totalesPorEstado[estado] || 0
              const percentage = carteraTotal > 0 ? (val / carteraTotal) * 100 : 0
              
              const colors: Record<string, string> = {
                'AL_DIA': 'bg-green-500',
                'EN_RIESGO': 'bg-yellow-500',
                'VENCIDO': 'bg-orange-500',
                'CRITICO': 'bg-red-500',
              }

              return (
                <div key={estado}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--text-muted)]">{estado.replace('_', ' ')}</span>
                    <span className="text-white font-medium">{formatCOP(val)}</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[estado]} rounded-full`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
