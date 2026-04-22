"use client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle2, XCircle, Mail } from "lucide-react"

interface Props {
  notificaciones: any[]
}

export const NotificacionTable = ({ notificaciones }: Props) => {
  return (
    <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
      <div className="p-4 border-b border-[var(--border)] bg-white/5">
        <h2 className="font-heading font-bold text-white text-lg">Historial de Notificaciones</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-muted)]">
          <thead className="bg-white/5 text-xs text-[var(--text-muted)] font-semibold border-b border-[var(--border)] uppercase">
            <tr>
              <th className="px-6 py-4">Cliente / Destino</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Mensaje / Detalle</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {notificaciones.length > 0 ? notificaciones.map((n) => (
              <tr key={n.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-white whitespace-nowrap">{n.cuenta.cliente.nombre}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 w-fit text-xs font-medium">
                    <Mail size={12} /> {n.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-sm">
                  <p className="truncate text-xs">{n.mensaje}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  {n.exitosa ? (
                    <span className="text-green-400 flex items-center justify-center gap-1.5 font-medium">
                      <CheckCircle2 size={16} /> Exitosa
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center justify-center gap-1.5 font-medium">
                      <XCircle size={16} /> Fallida
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap text-xs">
                  {format(new Date(n.enviadaEn), "dd MMM yyyy, HH:mm", { locale: es })}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm">
                  Aún no se ha enviado ninguna notificación.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
