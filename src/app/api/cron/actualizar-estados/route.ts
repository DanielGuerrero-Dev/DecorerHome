import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { classifyEstado } from "@/lib/classifyEstado"

// Route meant to be called by Vercel Cron Jobs daily
export async function GET(req: Request) {
  try {
    const cuentas = await prisma.cuenta.findMany()
    
    // Process in batches or all together for a small PYME
    let updatedCount = 0

    const updates = cuentas.map(c => {
      const nuevoEstado = classifyEstado(c.fechaVencimiento, c.saldoPendiente)
      if (nuevoEstado !== c.estado) {
        updatedCount++
        return prisma.cuenta.update({
          where: { id: c.id },
          data: { estado: nuevoEstado }
        })
      }
    }).filter(Boolean)

    if (updates.length > 0) {
      await prisma.$transaction(updates as any)
    }

    return NextResponse.json({ success: true, updated: updatedCount })
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
