"use client"
import { useState } from "react"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ClienteModal } from "./ClienteModal"
import { formatCOP } from "@/lib/formatCOP"
import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface Props {
  clientes: any[]
}

export const ClienteTable = ({ clientes }: Props) => {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<any>(null)

  const handleEdit = (c: any) => {
    setSelectedCliente(c)
    setModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${name}? Esto borrará también todas sus cuentas y pagos.`)) return
    
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success("Cliente eliminado")
        router.refresh()
      } else {
        toast.error("Ocurrió un error")
      }
    } catch {
      toast.error("Fallo de red")
    }
  }

  return (
    <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
      
      <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-white/5">
        <h2 className="font-heading font-bold text-white text-lg">Directorio de Clientes</h2>
        <Button onClick={() => { setSelectedCliente(null); setModalOpen(true); }} variant="primary" className="py-1.5 px-4 text-sm">
          + Nuevo Cliente
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-muted)]">
          <thead className="bg-white/5 text-xs text-[var(--text-muted)] font-semibold border-b border-[var(--border)] uppercase">
            <tr>
              <th className="px-6 py-4">Nombre / Cédula</th>
              <th className="px-6 py-4">Contacto</th>
              <th className="px-6 py-4 text-center">N° Cuentas</th>
              <th className="px-6 py-4">Saldo Total</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {clientes.length > 0 ? clientes.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-semibold text-white whitespace-nowrap">{c.nombre}</p>
                  <p className="text-xs mt-1">CC: {c.cedula}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-white">{c.telefono}</p>
                  {c.email && <p className="text-xs">{c.email}</p>}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white font-medium text-xs">
                    {c.totalCuentas}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                  {formatCOP(c.saldoTotal)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Link href={`/dashboard/clientes/${c.id}`} className="p-2 hover:bg-black/20 hover:text-white rounded transition-colors text-[var(--text-muted)]" title="Ver detalle">
                      <Eye size={18} />
                    </Link>
                    <button onClick={() => handleEdit(c)} className="p-2 hover:bg-black/20 hover:text-white rounded transition-colors" title="Editar">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(c.id, c.nombre)} className="p-2 hover:bg-red-500/20 text-red-500 rounded transition-colors" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm">
                  No hay clientes registrados en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ClienteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} clienteToEdit={selectedCliente} />
    </div>
  )
}
