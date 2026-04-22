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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
      include: {
        cuentas: {
          orderBy: { createdAt: "desc" },
          include: {
            pagos: {
              orderBy: { fecha: "desc" }
            }
          }
        }
      }
    })

    if (!cliente) return NextResponse.json({ error: "Not Found" }, { status: 404 })

    return NextResponse.json(cliente)
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const validData = clienteSchema.parse(body)

    // Check unique cedula if changed
    const exists = await prisma.cliente.findFirst({
      where: { cedula: validData.cedula, NOT: { id: params.id } }
    })
    
    if (exists) {
      return NextResponse.json({ error: "Ya existe otro cliente con esa cédula." }, { status: 400 })
    }

    const updated = await prisma.cliente.update({
      where: { id: params.id },
      data: validData
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    // Delete validation or cascade delete is handled by Prisma Schema
    await prisma.cliente.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
