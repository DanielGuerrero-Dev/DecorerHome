import Link from "next/link"
import { Building2 } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] pt-16 pb-8 bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="text-[var(--accent-to)]" size={24} />
              <span className="font-heading font-bold text-xl text-white tracking-wider">DECORER</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm max-w-sm text-center md:text-left">
              Gestión inteligente de cartera para PYMES colombianas. Controla tu flujo de efectivo de manera fácil y automática.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-[var(--text-muted)] font-medium">
            <a href="#caracteristicas" className="hover:text-white transition-colors">Características</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
            <Link href="/login" className="hover:text-white transition-colors">Iniciar sesión</Link>
          </div>

        </div>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)]">
          <p>© 2026 Decorer · Mocoa, Putumayo, Colombia</p>
          <p>Desarrollado con ♥ en Colombia 🇨🇴</p>
        </div>
      </div>
    </footer>
  )
}
