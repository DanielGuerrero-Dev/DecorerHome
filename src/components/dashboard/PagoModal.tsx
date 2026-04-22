"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { FileText, DollarSign } from "lucide-react"
import { formatCOP } from "@/lib/formatCOP"

const formSchema = z.object({
  monto: z.coerce.number().positive("El monto debe ser positivo"),
  notas: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  isOpen: boolean
  onClose: () => void
  cuentaId: string | null
  saldoPendiente: number
}

export const PagoModal = ({ isOpen, onClose, cuentaId, saldoPendiente }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { monto: 0, notas: "" }
  })

  // Validate that payment is not exceeding balance on client side for UX
  const onSubmit = async (data: FormValues) => {
    if (!cuentaId) return
    if (data.monto > saldoPendiente) {
      toast.error("El pago no puede exceder el saldo pendiente")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, cuentaId })
      })

      const result = await res.json()

      if (res.ok) {
        toast.success("Pago registrado exitosamente")
        reset()
        router.refresh()
        onClose()
      } else {
        toast.error(result.error || "Ocurrió un error")
      }
    } catch (e) {
      toast.error("Error de conexión al registrar pago")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago">
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[var(--accent-from)]/10 to-transparent border border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)] mb-1">Saldo pendiente actual</p>
        <p className="font-heading font-bold text-2xl text-[var(--text-primary)]">{formatCOP(saldoPendiente)}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          label="Monto a pagar *" 
          type="number"
          step="0.01"
          icon={<DollarSign size={16} />} 
          {...register("monto")} 
          error={errors.monto?.message} 
        />
        
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-[var(--text-muted)]">Notas del pago</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-[var(--text-muted)]" size={16} />
            <textarea 
              {...register("notas")} 
              rows={3}
              placeholder="Referencia, número de consignación, etc."
              className="w-full bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg py-2.5 outline-none transition-all pl-10 pr-4 focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={loading} className="bg-green-500 hover:bg-green-600 border-none shadow-[0_0_16px_rgba(34,197,94,0.3)] hover:shadow-[0_0_24px_rgba(34,197,94,0.4)] text-white">Confirmar Pago</Button>
        </div>
      </form>
    </Modal>
  )
}
