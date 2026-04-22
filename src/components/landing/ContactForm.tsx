"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export const ContactForm = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success("Mensaje enviado con éxito. Te contactaremos pronto.")
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error("Failed")
      }
    } catch (error) {
      toast.error("Ocurrió un error al enviar tu mensaje. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacto" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent-from)]/5 pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            ¿Listo para recuperar tu dinero?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-muted)] md:text-lg"
          >
            Escríbenos y te mostramos cómo funciona para tu negocio.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="glass p-8 md:p-10 rounded-2xl flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-muted)]">Nombre completo</label>
                <input required name="nombre" className="bg-[var(--bg-base)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-muted)]">Nombre empresa</label>
                <input required name="empresa" className="bg-[var(--bg-base)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-muted)]">Email</label>
                <input required type="email" name="email" className="bg-[var(--bg-base)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-muted)]">Teléfono</label>
                <input required type="tel" name="telefono" className="bg-[var(--bg-base)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-muted)]">Mensaje</label>
              <textarea name="mensaje" rows={4} className="bg-[var(--bg-base)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-from)] focus:ring-1 focus:ring-[var(--accent-from)] transition-all resize-none"></textarea>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="mt-4 py-4 rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-medium shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Enviar mensaje <Send size={18} /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
