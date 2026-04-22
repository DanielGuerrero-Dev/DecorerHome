"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, CreditCard, Phone, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"

export default function ConsultaPublicaPage() {
  const [cedula, setCedula] = useState("")
  const [digitos, setDigitos] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorAnim, setErrorAnim] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorAnim(false)
    setLoading(true)

    try {
      const res = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, digitos })
      })

      const data = await res.json()
      if (res.ok) {
        toast.success("Verificación exitosa")
        router.push("/portal")
        router.refresh()
      } else {
        toast.error(data.error || "Datos inválidos")
        setErrorAnim(true)
        setLoading(false)
      }
    } catch {
      toast.error("Error de conexión")
      setErrorAnim(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[var(--bg-base)]">
      {/* Background Animated Blobs simulation */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-from)]/10 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-[var(--accent-to)]/10 blur-[100px] rounded-full mix-blend-screen opacity-50 animate-pulse delay-1000" />
      
      <div className="z-10 w-full max-w-lg px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 sm:p-10 rounded-3xl w-full flex flex-col border border-[var(--border)] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(139,92,246,0.35)]">
              <Building2 className="text-white" size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">Portal de Autogestión</h1>
            <p className="text-[var(--text-muted)] text-sm px-4">Ingresa con tu documento de identidad para consultar el estado de tus cuentas.</p>
          </div>

          <motion.form 
            onSubmit={handleSubmit}
            className="w-full flex flex-col space-y-5"
            animate={errorAnim ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">Número de Cédula o NIT</label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full bg-white/5 border border-[var(--border)] text-white rounded-xl py-3.5 px-11 focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all placeholder:text-gray-600"
                  placeholder="Ej. 1085123456"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">Últimos 4 dígitos del Celular</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="text"
                  maxLength={4}
                  value={digitos}
                  onChange={(e) => setDigitos(e.target.value)}
                  className="w-full bg-white/5 border border-[var(--border)] text-white rounded-xl py-3.5 px-11 focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all placeholder:text-gray-600"
                  placeholder="Ej. 4567"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">Medida de seguridad para verificar tu identidad.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-medium shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:shadow-[0_0_32px_rgba(139,92,246,0.4)] transition-all flex justify-center items-center mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Consultar Estado de Cuenta"}
            </button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
