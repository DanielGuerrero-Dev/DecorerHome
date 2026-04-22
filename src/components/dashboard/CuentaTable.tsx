"use client"
import { useState, useMemo } from "react"
import { EstadoBadge } from "./EstadoBadge"
import { Button } from "@/components/ui/Button"
import { formatCOP } from "@/lib/formatCOP"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import { Send, CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { PagoModal } from "./PagoModal"
import toast from "react-hot-toast"

interface Props {
  cuentas: any[]
}

const TABS = [
  { id: 'TODAS', label: 'Todas' },
  { id: 'AL_DIA', label: 'Al día' },
  { id: 'EN_RIESGO', label: 'En riesgo' },
  { id: 'VENCIDO', label: 'Vencidas' },
  { id: 'CRITICO', label: 'Críticas' }
]

export const CuentaTable = ({ cuentas }: Props) => {
  const [activeTab, setActiveTab] = useState('TODAS')
  
  // Modal state
  const [pagoModalData, setPagoModalData] = useState<{ id: string | null, saldo: number }>({ id: null, saldo: 0 })

  const filteredCuentas = useMemo(() => {
    if (activeTab === 'TODAS') return cuentas
    return cuentas.filter(c => c.estado === activeTab)
  }, [cuentas, activeTab])

  const counts: Record<string, number> = {
    'TODAS': cuentas.length,
    'AL_DIA': cuentas.filter(c => c.estado === 'AL_DIA').length,
    'EN_RIESGO': cuentas.filter(c => c.estado === 'EN_RIESGO').length,
    'VENCIDO': cuentas.filter(c => c.estado === 'VENCIDO').length,
    'CRITICO': cuentas.filter(c => c.estado === 'CRITICO').length,
  }

  const handleSendReminder = async (cuentaId: string) => {
    try {
      const res = await fetch("/api/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "SINGLE", cuentaId })
      })
      if (res.ok) {
        toast.success("Recordatorio enviado")
      } else {
        toast.error("Error al enviar recordatorio")
      }
    } catch {
      toast.error("Fallo de red")
    }
  }

  const handleMassiveReminder = async () => {
    try {
      const res = await fetch("/api/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "MASSIVE" })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Emails masivos enviados: ${data.count}`)
      } else {
        toast.error("Error al enviar masivos")
      }
    } catch {
      toast.error("Fallo de red")
    }
  }

  return (
    <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col">
      
      {/* Header and Tabs */}
      <div className="border-b border-[var(--border)]">
        <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
          <h2 className="font-heading font-bold text-white text-lg">Estado General de Cartera</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <Button onClick={handleMassiveReminder} variant="outline" className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10 text-xs py-1.5 w-full md:w-auto flex-1">
               <Send size={16} /> Recordatorio Masivo
             </Button>
             <Button variant="primary" className="py-1.5 text-xs w-full md:w-auto flex-1">
               + Nueva Cuenta
             </Button>
          </div>
        </div>
        
        <div className="px-4 overflow-x-auto flex gap-2 no-scrollbar border-t border-[var(--border)] bg-black/20 pt-2 pb-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm font-medium border
                ${activeTab === tab.id 
                  ? "bg-white/10 text-white border-[var(--border)] shadow-sm" 
                  : "bg-transparent text-[var(--text-muted)] border-transparent hover:bg-white/5 hover:text-white"
                }`}
            >
              {tab.label}
              <span className={`px-2 rounded-full text-xs hidden md:inline-block ${activeTab === tab.id ? 'bg-[var(--accent-from)] text-white' : 'bg-white/10 text-[var(--text-muted)]'}`}>
                {counts[tab.id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-muted)]">
          <thead className="bg-white/5 text-xs text-[var(--text-muted)] font-semibold border-b border-[var(--border)] uppercase">
            <tr>
              <th className="px-6 py-4">Cliente / Concepto</th>
              <th className="px-6 py-4">V. Total / Saldo</th>
              <th className="px-6 py-4">Vencimiento / Mora</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredCuentas.length > 0 ? filteredCuentas.map((c) => {
              const dias = differenceInDays(new Date(), new Date(c.fechaVencimiento))
              const moraText = dias > 0 ? `${dias} días de mora` : dias === 0 ? "Vence hoy" : `Faltan ${Math.abs(dias)} días`
              
              return (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white truncate max-w-[200px]" title={c.cliente.nombre}>{c.cliente.nombre}</p>
                    <p className="text-xs mt-1 truncate max-w-[200px]" title={c.concepto}>{c.concepto}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs mb-1 line-through opacity-70">{formatCOP(c.valorTotal)}</p>
                    <p className="font-bold text-white">{formatCOP(c.saldoPendiente)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-white mb-1">{format(new Date(c.fechaVencimiento), "dd MMM yyyy", { locale: es })}</p>
                    <p className={`text-xs flex items-center gap-1 ${dias > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {dias > 0 ? <AlertTriangle size={12}/> : <CheckCircle2 size={12}/>}
                      {moraText}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <EstadoBadge estado={c.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-50 xl:opacity-100 group-hover:opacity-100 transition-opacity">
                      <Button 
                        onClick={() => setPagoModalData({ id: c.id, saldo: c.saldoPendiente })} 
                        className="py-1 px-3 text-xs bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white"
                        disabled={c.saldoPendiente === 0}
                      >
                        Pagar
                      </Button>
                      <Button onClick={() => handleSendReminder(c.id)} className="py-1 px-3 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white">
                        Recordar
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm">
                  No se encontraron cuentas en este estado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PagoModal 
        isOpen={!!pagoModalData.id} 
        onClose={() => setPagoModalData({ id: null, saldo: 0 })} 
        cuentaId={pagoModalData.id} 
        saldoPendiente={pagoModalData.saldo} 
      />
    </div>
  )
}
