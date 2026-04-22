import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const cuentas = await prisma.cuenta.findMany({
      include: {
        cliente: true
      },
      orderBy: { fechaVencimiento: "asc" }
    })

    const headers = ["Cliente", "Cedula", "Telefono", "Concepto", "Estado", "Valor Total", "Saldo Pendiente", "Fecha Vencimiento"].join(",")
    
    const rows = cuentas.map(c => {
      const fecha = format(new Date(c.fechaVencimiento), "dd/MM/yyyy")
      return `"${c.cliente.nombre}","${c.cliente.cedula}","${c.cliente.telefono}","${c.concepto}","${c.estado}",${c.valorTotal},${c.saldoPendiente},"${fecha}"`
    })

    const csvContent = "\uFEFF" + headers + "\n" + rows.join("\n")

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="reporte_cartera_${format(new Date(), "yyyyMMdd")}.csv"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
