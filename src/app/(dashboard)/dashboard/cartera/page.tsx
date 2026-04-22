import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CuentaTable } from "@/components/dashboard/CuentaTable"

export const dynamic = "force-dynamic"

export default async function CarteraPage() {
  const session = await auth()

  const cuentas = await prisma.cuenta.findMany({
    include: {
      cliente: {
        select: { nombre: true, cedula: true, email: true }
      }
    },
    orderBy: { fechaVencimiento: "asc" }
  })

  return (
    <div className="flex flex-col gap-6">
      <CuentaTable cuentas={cuentas} />
    </div>
  )
}
