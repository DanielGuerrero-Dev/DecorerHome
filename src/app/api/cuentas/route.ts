import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { classifyEstado } from "@/lib/classifyEstado"

const cuentaSchema = z.object({
  clienteId: z.string(),
  concepto: z.string().min(2),
  valorTotal: z.number().positive(),
  fechaVencimiento: z.string().or(z.date()),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const validData = cuentaSchema.parse(body)

    const fechaVencimiento = new Date(validData.fechaVencimiento)
    const estado = classifyEstado(fechaVencimiento, validData.valorTotal)

    const newCuenta = await prisma.cuenta.create({
      data: {
        ...validData,
        fechaVencimiento,
        saldoPendiente: validData.valorTotal,
        estado
      }
    })

    return NextResponse.json(newCuenta)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
