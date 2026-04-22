"use client"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-from)]/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--accent-to)]/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse delay-700" />
      <div className="absolute bottom-1/4 left-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen opacity-40 animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 text-center lg:text-left mt-10 lg:mt-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading font-extrabold text-5xl md:text-7xl leading-tight mb-6"
            >
              Recupera tu cartera.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] animate-gradient-x">
                Automatiza tus cobros.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              El sistema inteligente que clasifica tus clientes, envía recordatorios automáticos y te muestra el estado real de tu dinero. Diseñado para PYMES en Colombia.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a href="#contacto" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-medium shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2 group">
                Solicitar Demo Gratis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#como-funciona" className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium text-[var(--text-primary)] hover:bg-white/5 transition-colors border border-transparent hover:border-[var(--border)] flex items-center justify-center">
                Ver demostración
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-[var(--text-muted)] font-medium"
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 className="text-[var(--accent-to)]" size={16}/> Cumple Ley 1581 de 2012</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="text-[var(--accent-to)]" size={16}/> Datos seguros</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="text-[var(--accent-to)]" size={16}/> Sin contratos</span>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 w-full max-w-lg lg:max-w-none hidden md:block"
          >
            <div className="glass p-6 rounded-2xl border-[var(--border)] shadow-2xl relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-[var(--accent-from)] text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold">
                Dashboard Demo
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-[var(--border)]">
                  <p className="text-[var(--text-muted)] text-xs mb-1 font-medium">Cartera Total</p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">$ 45.2M</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-[var(--border)]">
                  <p className="text-[var(--text-muted)] text-xs mb-1 font-medium">En Mora</p>
                  <p className="text-xl font-bold text-red-400">$ 12.8M</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-[var(--border)] h-48 flex items-end gap-2 pt-8">
                {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-[var(--accent-to)]/80 to-[var(--accent-from)] rounded-t-sm" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
