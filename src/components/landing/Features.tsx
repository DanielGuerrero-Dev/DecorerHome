"use client"
import { motion } from "framer-motion"
import { Users2, Bell, BarChart3, FileDown, ShieldCheck, Clock } from "lucide-react"

const features = [
  {
    icon: <Users2 size={24} />,
    title: "Clasificación Automática",
    description: "Clientes categorizados en tiempo real: Al día, En riesgo, Vencido o Crítico."
  },
  {
    icon: <Bell size={24} />,
    title: "Recordatorios Automáticos",
    description: "El sistema envía emails de cobro sin que tengas que hacer nada."
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Dashboard en Tiempo Real",
    description: "Ve el estado de tu cartera, flujo de efectivo y tendencias en un solo lugar."
  },
  {
    icon: <FileDown size={24} />,
    title: "Reportes Exportables",
    description: "Genera informes de cartera por período con un solo clic."
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Cumplimiento Legal",
    description: "Diseñado bajo la Ley 1581 de 2012 y el Estatuto del Consumidor colombiano."
  },
  {
    icon: <Clock size={24} />,
    title: "Historial Completo",
    description: "Registro de cada pago, recordatorio y gestión por cliente."
  }
]

export const Features = () => {
  return (
    <section id="caracteristicas" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--accent-from)]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-bold text-white mb-6"
          >
            Todo lo que necesitas para controlar tu cartera
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass p-8 rounded-2xl hover:bg-white/[0.06] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-from)]/20 text-[var(--accent-from)] flex items-center justify-center mb-6 border border-[var(--accent-from)]/30 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
