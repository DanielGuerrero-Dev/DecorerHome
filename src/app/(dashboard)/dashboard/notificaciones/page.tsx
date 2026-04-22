import { prisma } from "@/lib/prisma"
import { NotificacionTable } from "@/components/dashboard/NotificacionTable"

export const dynamic = "force-dynamic"

export default async function NotificacionesPage() {
  const notificaciones = await prisma.notificacion.findMany({
    include: {
      cuenta: {
        include: { cliente: true }
      }
    },
    orderBy: { enviadaEn: "desc" }
  })

  return (
    <div className="flex flex-col gap-6">
      <NotificacionTable notificaciones={notificaciones} />
    </div>
  )
}
