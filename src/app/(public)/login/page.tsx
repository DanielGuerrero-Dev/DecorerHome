import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginForm from "./LoginForm"

export const metadata = {
  title: "Iniciar Sesión - DECORER",
  description: "Ingreso al sistema de gestión de cartera DECORER.",
}

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Animated Blobs simulation */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-from)]/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-to)]/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse delay-1000" />
      
      <div className="z-10 w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  )
}
