import { prisma } from "@/lib/prisma"
import { formatCOP } from "@/lib/formatCOP"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { notFound } from "next/navigation"
import { EstadoBadge } from "@/components/dashboard/EstadoBadge"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin, FileText } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ClienteDetallePage({ params }: { params: { id: string } }) {
  const cliente = await prisma.cliente.findUnique({
    where: { id: params.id },
    include: {
      cuentas: {
        orderBy: { createdAt: "desc" },
        include: {
          pagos: {
            orderBy: { fecha: "desc" }
          }
        }
      }
    }
  })

  if (!cliente) return notFound()

  const saldoTotal = cliente.cuentas.reduce((acc, c) => acc + c.saldoPendiente, 0)

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clientes" className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">{cliente.nombre}</h1>
          <p className="text-[var(--text-muted)] text-sm">CC: {cliente.cedula}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-[var(--border)] col-span-2">
          <h3 className="text-lg font-heading font-semibold text-white mb-4">Información de Contacto</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-[var(--text-muted)]">
              <Phone size={18} />
              <span className="text-[var(--text-primary)]">{cliente.telefono}</span>
            </div>
            {cliente.email && (
              <div className="flex items-center gap-3 text-[var(--text-muted)]">
                <Mail size={18} />
                <span className="text-[var(--text-primary)]">{cliente.email}</span>
              </div>
            )}
            {cliente.direccion && (
              <div className="flex items-center gap-3 text-[var(--text-muted)]">
                <MapPin size={18} />
                <span className="text-[var(--text-primary)]">{cliente.direccion}</span>
              </div>
            )}
            {cliente.notas && (
              <div className="flex items-center gap-3 text-[var(--text-muted)] col-span-2">
                <FileText size={18} />
                <span className="text-[var(--text-primary)]">{cliente.notas}</span>
              </div>
            )}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-[var(--border)] flex flex-col justify-center items-center text-center">
          <p className="text-[var(--text-muted)] text-sm mb-2">Saldo Total Pendiente</p>
          <p className="text-3xl font-heading font-bold text-[var(--accent-from)]">{formatCOP(saldoTotal)}</p>
          <p className="text-[var(--text-muted)] text-xs mt-2">{cliente.cuentas.length} cuentas activas</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-heading font-bold text-white">Estado de Cuentas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-muted)]">
            <thead className="bg-white/5 text-xs uppercase text-[var(--text-muted)] font-semibold border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4">Concepto</th>
                <th className="px-6 py-4">S. Pendiente / V. Total</th>
                <th className="px-6 py-4">Vencimiento</th>
                <th className="px-6 py-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {cliente.cuentas.length > 0 ? (
                cliente.cuentas.map((cuenta) => (
                  <tr key={cuenta.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                      {cuenta.concepto}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white">{formatCOP(cuenta.saldoPendiente)}</span>
                      <span className="text-xs ml-1 opacity-60">/ {formatCOP(cuenta.valorTotal)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(cuenta.fechaVencimiento), "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <EstadoBadge estado={cuenta.estado} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-muted)]">
                    No posee cuentas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
