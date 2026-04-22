import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar } from "@/components/dashboard/Topbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex">
      <Sidebar user={session.user} />
      <div className="ml-[240px] flex-1 flex flex-col min-h-screen">
        <Topbar user={session.user} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
