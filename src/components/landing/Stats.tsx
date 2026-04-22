"use client"
import { motion } from "framer-motion"

const stats = [
  { value: "40%", label: "Reducción de cartera vencida" },
  { value: "3x", label: "Más rápido en recuperación" },
  { value: "100%", label: "Automatización de recordatorios" },
  { value: "0 COP", label: "Costo para empezar" },
]

export const Stats = () => {
  return (
    <section className="py-20 border-y border-[var(--border)] bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                {stat.value}
              </p>
              <p className="text-[var(--text-muted)] text-sm font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
