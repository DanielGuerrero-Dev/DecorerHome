import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { name, image } = body

    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
    }

    // Update in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name,
        ...(image !== undefined && { image }) // only update image if provided
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        image: updatedUser.image
      } 
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
