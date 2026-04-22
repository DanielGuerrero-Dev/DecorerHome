"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2 } from "lucide-react"

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass py-4 shadow-lg" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.2)] group-hover:scale-105 transition-transform">
            <Building2 className="text-white" size={20} />
          </div>
          <span className="font-heading font-bold text-xl text-white tracking-wider">DECORER</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
          <a href="#caracteristicas" className="hover:text-white transition-colors">Características</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
          <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block py-2 px-4 rounded-lg font-medium border border-[var(--border)] hover:bg-white/5 transition-colors text-sm">
            Iniciar sesión
          </Link>
          <a href="#contacto" className="py-2 px-5 rounded-lg bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-medium shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] transition-all text-sm">
            Solicitar Demo
          </a>
        </div>
      </div>
    </nav>
  )
}
