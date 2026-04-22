import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendLeadNotification } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Save to DB
    const lead = await prisma.lead.create({
      data: {
        nombre: body.nombre,
        empresa: body.empresa,
        email: body.email,
        telefono: body.telefono,
        mensaje: body.mensaje
      }
    })

    // Send email notification non-blocking
    sendLeadNotification(lead).catch(err => console.error("Error sending lead email:", err))

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error("Lead API Error:", error)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
