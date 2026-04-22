import { redirect } from "next/navigation"
import { getPortalSession } from "@/lib/portalAuth"
import Link from "next/link"
import { Building2, LogOut } from "lucide-react"

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getPortalSession()
  
  if (!session) {
    redirect("/consultar")
  }
  
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white font-sans selection:bg-[var(--accent-from)] selection:text-white pb-12">
      {/* Navbar simplificado */}
      <header className="border-b border-[var(--border)] bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center">
              <Building2 className="text-white" size={16} />
            </div>
            <span className="font-heading font-bold text-lg text-white group-hover:text-[var(--accent-from)] transition-colors">DECORER</span>
          </Link>
          
          <form action="/api/portal/logout" method="POST">
            <button type="submit" className="text-sm font-medium text-[var(--text-muted)] hover:text-white flex items-center gap-2 transition-colors">
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8">
        {children}
      </main>
    </div>
  )
}
