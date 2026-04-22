import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { SignJWT } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "decorer-secret-2026")

export async function POST(req: Request) {
  try {
    const { cedula, digitos } = await req.json()

    if (!cedula || !digitos) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    const cliente = await prisma.cliente.findUnique({
      where: { cedula }
    })

    if (!cliente) {
      return NextResponse.json({ error: "Identificación no encontrada en el sistema" }, { status: 404 })
    }

    // Validar últimos 4 dígitos
    const cleanPhone = cliente.telefono.replace(/\D/g, '')
    const last4 = cleanPhone.slice(-4)

    if (last4 !== digitos) {
      return NextResponse.json({ error: "Código de seguridad (teléfono) incorrecto" }, { status: 401 })
    }

    // Auth OK
    const token = await new SignJWT({ id: cliente.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(JWT_SECRET)

    cookies().set('portal_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Portal Auth Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
