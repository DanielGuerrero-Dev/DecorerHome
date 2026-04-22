import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const clienteSchema = z.object({
  nombre: z.string().min(3),
  cedula: z.string().min(5),
  email: z.union([z.string().email(), z.literal(""), z.null()]).optional(),
  telefono: z.string().min(7),
  direccion: z.string().optional(),
  notas: z.string().optional(),
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const take = 10
  const skip = (page - 1) * take

  try {
    const whereClause = {
      OR: [
        { nombre: { contains: q, mode: "insensitive" as const } },
        { cedula: { contains: q, mode: "insensitive" as const } },
      ]
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where: whereClause,
        include: {
          cuentas: {
            select: {
              saldoPendiente: true,
              estado: true
            }
          }
        },
        skip,
        take,
        orderBy: { createdAt: "desc" }
      }),
      prisma.cliente.count({ where: whereClause })
    ])

    // Format data slightly to include totals
    const formatted = clientes.map(c => ({
      ...c,
      totalCuentas: c.cuentas.length,
      saldoTotal: c.cuentas.reduce((acc, curr) => acc + curr.saldoPendiente, 0),
      estados: Array.from(new Set(c.cuentas.map(ct => ct.estado)))
    }))

    return NextResponse.json({ data: formatted, total, page, pages: Math.ceil(total / take) })
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const validData = clienteSchema.parse(body)

    // Check unique cedula
    const exists = await prisma.cliente.findUnique({ where: { cedula: validData.cedula } })
    if (exists) {
      return NextResponse.json({ error: "Ya existe un cliente con esa cédula." }, { status: 400 })
    }

    const newCliente = await prisma.cliente.create({
      data: validData
    })

    return NextResponse.json(newCliente)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
