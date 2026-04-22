"use client"
import { motion } from "framer-motion"
import { UserPlus, Cpu, MailCheck, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: <UserPlus size={24} />,
    title: "Registra tus clientes",
    description: "Ingresa la información del cliente y el valor del crédito otorgado."
  },
  {
    icon: <Cpu size={24} />,
    title: "El sistema clasifica",
    description: "Automáticamente asigna el estado según la fecha de vencimiento."
  },
  {
    icon: <MailCheck size={24} />,
    title: "Se envían recordatorios",
    description: "Emails automáticos llegan al cliente antes y después del vencimiento."
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Tú controlas todo",
    description: "Monitoreas cobros, registras pagos y ves tu flujo de efectivo."
  }
]

export const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 bg-black/20 border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-bold text-white"
          >
            Cómo funciona
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[var(--border)] via-[var(--accent-from)]/50 to-[var(--border)] border-dashed border-t-2 border-transparent pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, var(--border) 50%, transparent 50%)', backgroundSize: '15px 100%' }} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full glass border-2 border-[var(--border)] flex items-center justify-center mb-6 relative group-hover:border-[var(--accent-from)] transition-colors shadow-xl">
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[var(--accent-from)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[var(--text-muted)] group-hover:text-[var(--accent-from)] transition-colors">
                    {step.icon}
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--bg-base)] border border-[var(--border)] text-white font-bold flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-heading font-bold text-white mb-3">{step.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-sm max-w-[250px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
