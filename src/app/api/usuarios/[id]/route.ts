import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { z } from "zod"

const updateSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'COBRADOR', 'GERENTE']).optional()
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const { name, email, password, role } = parsed.data
    const dataToUpdate: any = {}
    
    if (name) dataToUpdate.name = name
    if (email) dataToUpdate.email = email
    if (role) dataToUpdate.role = role
    if (password && password.length >= 6) {
      dataToUpdate.password = await bcrypt.hash(password, 10)
    }

    // Verificar protección de admin único si quita su propio rol
    if (params.id === session.user.id && role && role !== 'ADMIN') {
         // Puedes evitar que se quite el rol a si mismo, pero por ahora permitimos
         // o forzamos requerimientos según necesidad
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, role: true }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Error interno / Correo duplicado" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  if (params.id === session.user.id) {
    return NextResponse.json({ error: "No puedes eliminarte a ti mismo" }, { status: 400 })
  }

  try {
    await prisma.user.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
