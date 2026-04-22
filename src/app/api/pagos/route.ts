import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { classifyEstado } from "@/lib/classifyEstado"

const pagoSchema = z.object({
  cuentaId: z.string(),
  monto: z.number().positive(),
  notas: z.string().optional()
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const validData = pagoSchema.parse(body)

    // Run within a transaction so we increment atomically
    const result = await prisma.$transaction(async (tx) => {
      const cuenta = await tx.cuenta.findUnique({ where: { id: validData.cuentaId } })
      if (!cuenta) throw new Error("Cuenta no encontrada")

      // No permitir pago mayor al saldo, o dejar en saldo a favor (asumimos no sobrepasa)
      // Math.max para que el saldo pendiente no sea negativo si excede
      const newSaldo = Math.max(0, cuenta.saldoPendiente - validData.monto)
      const newEstado = classifyEstado(cuenta.fechaVencimiento, newSaldo)

      const pago = await tx.pago.create({
        data: {
          cuentaId: cuenta.id,
          monto: validData.monto,
          notas: validData.notas
        }
      })

      const updatedCuenta = await tx.cuenta.update({
        where: { id: cuenta.id },
        data: {
          saldoPendiente: newSaldo,
          estado: newEstado
        }
      })

      return { pago, cuenta: updatedCuenta }
    })

    return NextResponse.json(result)
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 })
  }
}
