"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Mail, Phone, MapPin, User, FileText, CreditCard } from "lucide-react"

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  cedula: z.string().min(5, "Cédula inválida"),
  email: z.union([z.string().email("Email inválido"), z.literal(""), z.null()]).optional(),
  telefono: z.string().min(7, "Teléfono inválido"),
  direccion: z.string().optional(),
  notas: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  isOpen: boolean
  onClose: () => void
  clienteToEdit?: any | null
}

export const ClienteModal = ({ isOpen, onClose, clienteToEdit }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nombre: "", cedula: "", email: "", telefono: "", direccion: "", notas: "" }
  })

  useEffect(() => {
    if (clienteToEdit) {
      setValue("nombre", clienteToEdit.nombre || "")
      setValue("cedula", clienteToEdit.cedula || "")
      setValue("email", clienteToEdit.email || "")
      setValue("telefono", clienteToEdit.telefono || "")
      setValue("direccion", clienteToEdit.direccion || "")
      setValue("notas", clienteToEdit.notas || "")
    } else {
      reset()
    }
  }, [clienteToEdit, isOpen, setValue, reset])

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      const url = clienteToEdit ? `/api/clientes/${clienteToEdit.id}` : `/api/clientes`
      const method = clienteToEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (res.ok) {
        toast.success(clienteToEdit ? "Cliente actualizado" : "Cliente creado")
        router.refresh()
        onClose()
      } else {
        toast.error(result.error || "Ocurrió un error")
      }
    } catch (e) {
      toast.error("Error de comunicación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={clienteToEdit ? "Editar Cliente" : "Nuevo Cliente"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Nombre Completo *" 
            icon={<User size={16} />} 
            {...register("nombre")} 
            error={errors.nombre?.message} 
          />
          <Input 
            label="Cédula/NIT *" 
            icon={<CreditCard size={16} />} 
            {...register("cedula")} 
            error={errors.cedula?.message} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Teléfono *" 
            icon={<Phone size={16} />} 
            {...register("telefono")} 
            error={errors.telefono?.message} 
          />
          <Input 
            label="Email" 
            type="email"
            icon={<Mail size={16} />} 
            {...register("email")} 
            error={errors.email?.message} 
          />
        </div>

        <Input 
          label="Dirección" 
          icon={<MapPin size={16} />} 
          {...register("direccion")} 
          error={errors.direccion?.message} 
        />
        
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-[var(--text-muted)]">Notas Adicionales</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-[var(--text-muted)]" size={16} />
            <textarea 
              {...register("notas")} 
              rows={3}
              className="w-full bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg py-2.5 outline-none transition-all pl-10 pr-4 focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={loading}>{clienteToEdit ? "Guardar Cambios" : "Crear Cliente"}</Button>
        </div>
      </form>
    </Modal>
  )
}
