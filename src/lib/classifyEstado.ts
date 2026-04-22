import { differenceInDays } from "date-fns"
import { EstadoCuenta } from "@prisma/client"

export function classifyEstado(
  fechaVencimiento: Date,
  saldoPendiente: number
): EstadoCuenta {
  if (saldoPendiente <= 0) return 'AL_DIA'
  
  const hoy = new Date()
  const dias = differenceInDays(hoy, fechaVencimiento)
  
  if (dias < -7)  return 'AL_DIA'
  if (dias < 0)   return 'EN_RIESGO'
  if (dias <= 30) return 'VENCIDO'
  return 'CRITICO'
}
