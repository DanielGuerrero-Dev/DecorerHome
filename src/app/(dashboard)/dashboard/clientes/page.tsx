import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ClienteTable } from "@/components/dashboard/ClienteTable"

export const dynamic = "force-dynamic"

export default async function ClientesPage({
  searchParams
}: {
  searchParams: { q?: string, page?: string }
}) {
  const session = await auth()

  const q = searchParams.q || ""
  const page = parseInt(searchParams.page || "1", 10)
  const take = 10
  const skip = (page - 1) * take

  const whereClause = {
    OR: [
      { nombre: { contains: q, mode: "insensitive" as const } },
      { cedula: { contains: q, mode: "insensitive" as const } },
    ]
  }

  const clientes = await prisma.cliente.findMany({
    where: whereClause,
    include: {
      cuentas: {
        select: { saldoPendiente: true, estado: true }
      }
    },
    skip,
    take,
    orderBy: { createdAt: "desc" }
  })

  const formatted = clientes.map(c => ({
    ...c,
    totalCuentas: c.cuentas.length,
    saldoTotal: c.cuentas.reduce((acc, curr) => acc + curr.saldoPendiente, 0)
  }))

  return (
    <div className="flex flex-col gap-6">
      <ClienteTable clientes={formatted} />
    </div>
  )
}
