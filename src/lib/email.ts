import { Resend } from "resend"
import { formatCOP } from "./formatCOP"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const resend = new Resend(process.env.RESEND_API_KEY)

const emailTemplate = (contenido: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', Helvetica, sans-serif; background-color: #06060f; color: #f1f5f9; margin: 0; padding: 20px; }
    .container { max-w-xl; margin: 0 auto; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #6366f1, #a855f7); padding: 24px; text-align: center; }
    .header h1 { margin: 0; color: white; font-size: 24px; letter-spacing: 2px; }
    .content { padding: 32px; font-size: 16px; line-height: 1.6; color: #cbd5e1; }
    .footer { padding: 24px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); }
    .box { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; margin: 20px 0; }
    .highlight { color: #a855f7; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .right { text-align: right; font-weight: bold; color: white; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DECORER</h1>
    </div>
    <div class="content">
      ${contenido}
    </div>
    <div class="footer">
      <p>© 2026 DECORER, Mocoa - Putumayo</p>
      <p>Gestión inteligente de cobros. Ley 1581 de 2012.</p>
    </div>
  </div>
</body>
</html>
`

export async function sendReminderEmail(cliente: any, cuenta: any, tipo: 'RECORDATORIO' | 'CRITICO' = 'RECORDATORIO') {
  if (!cliente.email) return

  const subject = tipo === 'CRITICO' 
    ? "AVISO IMPORTANTE: Su cuenta en Decorer presenta un atraso significativo"
    : "Recordatorio de vencimiento de cuenta - Decorer"

  const html = emailTemplate(`
    <p>Hola <strong>${cliente.nombre}</strong>,</p>
    <p>Esperamos que te encuentres muy bien. Te escribimos para informarte sobre el estado de tu cuenta con nosotros por concepto de <strong>${cuenta.concepto}</strong>.</p>
    
    <div class="box">
      <table>
        <tr>
          <td>Saldo pendiente:</td>
          <td class="right">${formatCOP(cuenta.saldoPendiente)}</td>
        </tr>
        <tr>
          <td>Fecha límite:</td>
          <td class="right">${format(new Date(cuenta.fechaVencimiento), "dd 'de' MMMM, yyyy", { locale: es })}</td>
        </tr>
      </table>
    </div>

    ${tipo === 'CRITICO' 
      ? `<p style="color: #ef4444;">Su cuenta se encuentra en un estado crítico de mora. Por favor, comuníquese con nosotros de forma urgente para evitar recargos o reporte a centrales de riesgo.</p>`
      : `<p>Si ya realizaste el pago, por favor haz caso omiso a este mensaje. Agradecemos tu cumplimiento.</p>`
    }
    
    <p>Saludos cordiales,<br/>El equipo de DECORER</p>
  `)

  try {
    await resend.emails.send({
      from: "Decorer Cobranzas <cobros@decorer.com>",
      to: [cliente.email],
      subject,
      html
    })
    return { success: true }
  } catch (error) {
    console.error("Resend error:", error)
    return { success: false }
  }
}

export async function sendLeadNotification(lead: any) {
  const html = emailTemplate(`
    <h2 style="color: white; margin-top:0;">Nuevo Lead desde la Web</h2>
    <div class="box">
      <table>
        <tr><td><strong>Nombre:</strong></td><td class="right">${lead.nombre}</td></tr>
        <tr><td><strong>Empresa:</strong></td><td class="right">${lead.empresa}</td></tr>
        <tr><td><strong>Email:</strong></td><td class="right">${lead.email}</td></tr>
        <tr><td><strong>Teléfono:</strong></td><td class="right">${lead.telefono}</td></tr>
      </table>
    </div>
    <div class="box">
      <p style="margin:0;"><strong>Mensaje:</strong></p>
      <p style="margin-top:8px;">${lead.mensaje || 'Sin mensaje'}</p>
    </div>
  `)

  try {
    await resend.emails.send({
      from: "Web DECORER <web@decorer.com>",
      to: ["admin@decorer.com"],
      subject: `Nuevo Lead: ${lead.empresa}`,
      html
    })
    return { success: true }
  } catch (error) {
    console.error("Resend lead error:", error)
    return { success: false }
  }
}
