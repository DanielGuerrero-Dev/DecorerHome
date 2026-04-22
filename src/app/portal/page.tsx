import { prisma } from "@/lib/prisma"
import { getPortalSession } from "@/lib/portalAuth"
import { formatCOP } from "@/lib/formatCOP"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle2, AlertTriangle, AlertCircle, Clock, MessageCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PortalPage() {
  const session = await getPortalSession()
  
  const cliente = await prisma.cliente.findUnique({
    where: { id: session!.id },
    include: {
      cuentas: {
        orderBy: { fechaVencimiento: "asc" }
      }
    }
  })

  if (!cliente) return <div>Error cargando datos del cliente.</div>

  const saldoTotal = cliente.cuentas.reduce((acc, current) => acc + current.saldoPendiente, 0)
  
  const StatusIcon = ({ estado }: { estado: string }) => {
    switch(estado) {
      case 'AL_DIA': return <CheckCircle2 className="text-green-400" size={20} />
      case 'EN_RIESGO': return <Clock className="text-yellow-400" size={20} />
      case 'VENCIDO': return <AlertTriangle className="text-orange-400" size={20} />
      case 'CRITICO': return <AlertCircle className="text-red-400" size={20} />
      default: return null
    }
  }

  const StatusColor = (estado: string) => {
    switch(estado) {
      case 'AL_DIA': return "bg-green-500/10 text-green-400 border-green-500/20"
      case 'EN_RIESGO': return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case 'VENCIDO': return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case 'CRITICO': return "bg-red-500/10 text-red-500 border-red-500/20"
      default: return "bg-white/10 text-white"
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading font-bold text-white">Hola, {cliente.nombre.split(' ')[0]}</h1>
        <p className="text-[var(--text-muted)]">Aquí puedes revisar el estado detallado de tus cuentas con DECORER.</p>
      </div>

      {/* KPI Principal */}
      <div className="glass p-8 rounded-3xl border border-[var(--border)] relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--accent-from)] to-[var(--accent-to)]" />
        <p className="text-[var(--text-muted)] font-medium mb-1 uppercase tracking-wider text-sm">Saldo total adeudado</p>
        <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6 tracking-tight">
          {formatCOP(saldoTotal)}
        </h2>

        <a 
          href="https://wa.me/573000000000?text=Hola,%20soy%20cliente%20y%20quiero%20realizar%20un%20pago" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-medium hover:shadow-[0_0_24px_rgba(139,92,246,0.35)] transition-all"
        >
          <MessageCircle size={18} />
          Reportar un Pago por WhatsApp
        </a>
      </div>

      {/* Listado de Cuentas */}
      <div>
        <h3 className="text-xl font-heading font-semibold text-white mb-4">Detalle de tus Cuentas</h3>
        
        {cliente.cuentas.length === 0 ? (
          <div className="glass p-8 rounded-2xl text-center border border-[var(--border)]">
            <CheckCircle2 className="mx-auto text-green-400 mb-2" size={32} />
            <p className="text-[var(--text-muted)]">Actualmente no tienes saldos pendientes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cliente.cuentas.map(cuenta => (
              <div key={cuenta.id} className="glass p-6 rounded-2xl border border-[var(--border)] flex flex-col justify-between hover:bg-white/[0.02] transition-colors relative">
                
                {/* Badge Status */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${StatusColor(cuenta.estado)}`}>
                  <StatusIcon estado={cuenta.estado} />
                  {cuenta.estado.replace('_', ' ')}
                </div>

                <div>
                  <p className="text-[var(--text-muted)] text-sm mb-1 mt-6">Concepto</p>
                  <p className="text-lg font-bold text-white mb-4">{cuenta.concepto}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Valor Original:</span>
                      <span className="text-white">{formatCOP(cuenta.valorTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Saldo Pendiente:</span>
                      <span className="text-white font-semibold">{formatCOP(cuenta.saldoPendiente)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-[var(--text-muted)] text-sm">Fecha límite</span>
                  <span className={`text-sm font-medium ${new Date(cuenta.fechaVencimiento) < new Date() ? 'text-red-400' : 'text-white'}`}>
                    {format(new Date(cuenta.fechaVencimiento), "dd MMM yyyy", { locale: es })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
