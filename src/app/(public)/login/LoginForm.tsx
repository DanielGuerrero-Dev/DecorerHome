"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Mail, Lock, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError(true)
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-2xl w-full flex flex-col items-center"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(139,92,246,0.35)]">
          <Building2 className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">DECORER</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Gestión Inteligente de Cartera</p>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        className="w-full flex flex-col space-y-4"
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg py-3 px-10 focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all"
            placeholder="Correo electrónico"
            required
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg py-3 px-10 focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all"
            placeholder="Contraseña"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-red-400 text-sm text-center font-medium"
          >
            Credenciales incorrectas
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-medium shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] transition-all flex justify-center items-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Ingresar al sistema"}
        </button>
      </motion.form>
    </motion.div>
  )
}
