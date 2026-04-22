"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Camera, Loader2, CheckCircle2, User, Mail, ShieldAlert } from "lucide-react"

export default function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user?.name || "")
  const [imagePreview, setImagePreview] = useState(user?.image || "")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { update } = useSession()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no puede pesar más de 2MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      setError("")
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const res = await fetch("/api/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imagePreview })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Error al actualizar perfil")

      // Update NextAuth session client-side
      await update({ name, image: imagePreview })
      
      setSuccess(true)
      router.refresh()
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Header Profile Photo */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
          <div className="w-32 h-32 rounded-full border-4 border-[var(--bg-base)] shadow-[0_0_24px_rgba(139,92,246,0.35)] overflow-hidden bg-white/5 flex items-center justify-center transition-colors group-hover:border-[var(--accent-from)]">
            {imagePreview ? (
              <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-[var(--text-muted)]" />
            )}
          </div>
          
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
            <Camera size={24} className="mb-1" />
            <span className="text-xs font-medium">Cambiar</span>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/jpeg, image/png, image/webp"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-1">
            <label className="text-sm text-[var(--text-muted)] font-medium ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] text-white rounded-xl py-3 px-10 focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-muted)] font-medium ml-1">Correo Electrónico</label>
              <div className="relative opacity-60 cursor-not-allowed">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-muted)] rounded-xl py-3 px-10"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-muted)] font-medium ml-1">Rol en el Sistema</label>
              <div className="relative opacity-60 cursor-not-allowed">
                <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="text"
                  value={user?.role || ""}
                  disabled
                  className="w-full bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-muted)] rounded-xl py-3 px-10 font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm font-medium p-3 bg-red-400/10 rounded-lg border border-red-400/20">{error}</p>}
      
      {success && (
        <p className="text-green-400 text-sm font-medium flex items-center gap-2 p-3 bg-green-400/10 rounded-lg border border-green-400/20">
          <CheckCircle2 size={18} /> Perfil actualizado correctamente.
        </p>
      )}

      <div className="flex justify-end pt-4 border-t border-[var(--border)] mt-4">
        <button
          type="submit"
          disabled={loading || (name === user?.name && imagePreview === user?.image)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-medium shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Guardar Cambios"}
        </button>
      </div>
    </form>
  )
}
