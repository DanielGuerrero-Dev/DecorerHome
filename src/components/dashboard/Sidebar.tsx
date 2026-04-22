"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, LayoutDashboard, Users, Wallet, Bell, FileBarChart, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Clientes", href: "/dashboard/clientes", icon: <Users size={20} /> },
  { name: "Cartera", href: "/dashboard/cartera", icon: <Wallet size={20} /> },
  { name: "Notificaciones", href: "/dashboard/notificaciones", icon: <Bell size={20} /> },
  { name: "Reportes", href: "/dashboard/reportes", icon: <FileBarChart size={20} /> },
]

export const Sidebar = ({ user }: { user: any }) => {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] glass border-r border-[var(--border)] flex flex-col z-40 bg-[var(--bg-base)]/80">
      <div className="p-6 flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center">
          <Building2 className="text-white" size={16} />
        </div>
        <span className="font-heading font-bold text-lg text-white">DECORER</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                ${active 
                  ? "bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white shadow-[0_0_16px_rgba(139,92,246,0.25)]" 
                  : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <Link href="/dashboard/perfil" className="flex items-center gap-3 mb-4 p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-[var(--border)] overflow-hidden shrink-0 group-hover:border-[var(--accent-from)] transition-colors">
            {user?.image ? (
              <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || "U"
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white truncate group-hover:text-[var(--accent-from)] transition-colors">{user?.name}</span>
            <span className="text-xs text-[var(--text-muted)]">{user?.role}</span>
          </div>
        </Link>
        
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors font-medium text-sm"
        >
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
