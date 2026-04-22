import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { sendReminderEmail } from "@/lib/email"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { tipo, cuentaId } = await req.json() // tipo = "SINGLE" | "MASSIVE"

    if (tipo === "SINGLE") {
      const cuenta = await prisma.cuenta.findUnique({ 
        where: { id: cuentaId }, 
        include: { cliente: true } 
      })
      if (!cuenta) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

      const emailType = cuenta.estado === "CRITICO" ? "CRITICO" : "RECORDATORIO"
      const emailResult = await sendReminderEmail(cuenta.cliente, cuenta, emailType)

      await prisma.notificacion.create({
        data: {
          cuentaId: cuenta.id,
          tipo: "EMAIL",
          mensaje: `Recordatorio enviado a ${cuenta.cliente.email} - Estado: ${cuenta.estado}`,
          exitosa: emailResult?.success ?? false
        }
      })

      return NextResponse.json({ success: true })
    }

    if (tipo === "MASSIVE") {
      // Find all CRITICO or VENCIDA that haven't received an email in 3 days
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      const targetCuentas = await prisma.cuenta.findMany({
        where: {
          estado: { in: ['VENCIDO', 'CRITICO'] },
          notificaciones: {
            none: {
              enviadaEn: { gte: threeDaysAgo },
              exitosa: true
            }
          }
        },
        include: { cliente: true }
      })

      let sentCount = 0
      for (const cuenta of targetCuentas) {
        const emailType = cuenta.estado === "CRITICO" ? "CRITICO" : "RECORDATORIO"
        const r = await sendReminderEmail(cuenta.cliente, cuenta, emailType)
        
        await prisma.notificacion.create({
          data: {
            cuentaId: cuenta.id,
            tipo: "EMAIL",
            mensaje: `Envío masivo automático a ${cuenta.cliente.email}`,
            exitosa: r?.success ?? false
          }
        })
        if (r?.success) sentCount++
      }

      return NextResponse.json({ success: true, count: sentCount })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
