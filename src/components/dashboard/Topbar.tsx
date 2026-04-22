"use client"
import { usePathname } from "next/navigation"

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard Principal",
  "/dashboard/clientes": "Gestión de Clientes",
  "/dashboard/cartera": "Estado de la Cartera",
  "/dashboard/notificaciones": "Log de Notificaciones",
  "/dashboard/reportes": "Reportes",
}

export const Topbar = ({ user }: { user: any }) => {
  const pathname = usePathname()
  
  // Try exact match or base matching
  let title = "Sistema DECORER"
  if (routeTitles[pathname]) {
    title = routeTitles[pathname]
  } else if (pathname.startsWith("/dashboard/clientes/")) {
    title = "Detalle del Cliente"
  }

  return (
    <header className="h-[72px] sticky top-0 z-30 glass border-b border-[var(--border)] flex items-center justify-between px-8 bg-[var(--bg-base)]/80">
      <h1 className="text-xl font-heading font-semibold text-white">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Placeholder for extra actions like global search or bell icon if requested later */}
        <div className="w-10 h-10 rounded-full glass border border-[var(--border)] flex items-center justify-center text-white font-bold cursor-pointer hover:bg-white/5 transition-colors">
          {user?.name?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  )
}
