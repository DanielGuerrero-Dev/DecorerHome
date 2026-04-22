import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/dashboard/ProfileForm"

export const metadata = {
  title: "Mi Perfil - DECORER",
}

export default async function PerfilPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-[var(--text-muted)]">Personaliza tu experiencia y actualiza tu información de contacto.</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-[var(--border)] relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent mt-4">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--accent-from)] to-[var(--accent-to)]" />
        <ProfileForm user={session.user} />
      </div>
    </div>
  )
}
