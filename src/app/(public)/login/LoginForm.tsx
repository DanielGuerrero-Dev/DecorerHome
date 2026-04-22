"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Mail, Lock, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error")
  
  let errorMessage = ""
  if (urlError === "business_domain") {
    errorMessage = "Las cuentas empresariales no están permitidas. Por favor usa un correo personal de Google (@gmail.com)."
  } else if (urlError === "OAuthAccountNotLinked" || urlError === "EmailSignin") {
    errorMessage = "Este correo ya está registrado con contraseña. Por favor inicia sesión con tus credenciales."
  } else if (urlError === "AccessDenied") {
    errorMessage = "Acceso denegado por políticas de seguridad."
  } else if (urlError) {
    errorMessage = "Ocurrió un error al intentar iniciar sesión con Google."
  }

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
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(139,92,246,0.35)]">
          <Building2 className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">DECORER</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Gestión Inteligente de Cartera</p>
      </div>

      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400"
        >
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </motion.div>
      )}

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

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-[var(--border)]"></div>
          <span className="flex-shrink-0 mx-4 text-[var(--text-muted)] text-sm">O</span>
          <div className="flex-grow border-t border-[var(--border)]"></div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[#ffffff] hover:bg-gray-100 text-gray-900 font-medium transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Continuar con Google
        </button>
      </motion.form>
    </motion.div>
  )
}
