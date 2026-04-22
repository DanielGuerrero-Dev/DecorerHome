import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding data...')

  // Limpiar datos previos
  await prisma.lead.deleteMany()
  await prisma.notificacion.deleteMany()
  await prisma.pago.deleteMany()
  await prisma.cuenta.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.user.deleteMany()

  // 1. Usuarios
  const adminPassword = await bcrypt.hash('Decorer2026!', 10)
  const cobrosPassword = await bcrypt.hash('Cobros2026!', 10)
  const gerenciaPassword = await bcrypt.hash('Gerencia2026!', 10)

  await prisma.user.createMany({
    data: [
      { name: 'Admin Decorer', email: 'admin@decorer.com', password: adminPassword, role: 'ADMIN' },
      { name: 'Cobranzas', email: 'cobros@decorer.com', password: cobrosPassword, role: 'COBRADOR' },
      { name: 'Gerencia General', email: 'gerencia@decorer.com', password: gerenciaPassword, role: 'GERENTE' }
    ]
  })

  // 2. Clientes
  const clientesData = [
    { nombre: 'Carlos Andrés Muñoz Torres', cedula: '1075432198', email: 'carlos@ejemplo.com', telefono: '3101234567', direccion: 'Mocoa' },
    { nombre: 'Sandra Patricia López Díaz', cedula: '36154781', email: 'sandra@ejemplo.com', telefono: '3209876543', direccion: 'Villagarzón' },
    { nombre: 'Jhon Fredy Guerrero Pardo', cedula: '1085673421', email: 'jhon@ejemplo.com', telefono: '3004567890', direccion: 'Puerto Asís' },
    { nombre: 'María Elena Ruiz Castillo', cedula: '52896341', email: 'maria@ejemplo.com', telefono: '3157890123', direccion: 'Mocoa' },
    { nombre: 'Luis Eduardo Portilla Chaves', cedula: '18394021', email: 'luis@ejemplo.com', telefono: '3112345678', direccion: 'Sibundoy' }
  ]

  const clientes = await Promise.all(
    clientesData.map(c => prisma.cliente.create({ data: c }))
  )

  // 3. Cuentas (10 cuentas)
  const hoy = new Date()

  // Helpers para generar fechas
  const addDays = (d: Date, days: number) => { const nd = new Date(d); nd.setDate(d.getDate() + days); return nd }
  
  const cuentasData = [
    // AL_DIA
    { clienteId: clientes[0].id, concepto: 'Mobiliario Oficina', valorTotal: 1500000, saldoPendiente: 1500000, fechaVencimiento: addDays(hoy, 15), estado: 'AL_DIA' as const },
    { clienteId: clientes[1].id, concepto: 'Decoración Sala', valorTotal: 850000, saldoPendiente: 850000, fechaVencimiento: addDays(hoy, 20), estado: 'AL_DIA' as const },
    
    // EN_RIESGO
    { clienteId: clientes[2].id, concepto: 'Remodelación Cocina', valorTotal: 2500000, saldoPendiente: 2500000, fechaVencimiento: addDays(hoy, 3), estado: 'EN_RIESGO' as const },
    { clienteId: clientes[3].id, concepto: 'Iluminación LED', valorTotal: 450000, saldoPendiente: 450000, fechaVencimiento: addDays(hoy, 5), estado: 'EN_RIESGO' as const },
    
    // VENCIDO
    { clienteId: clientes[4].id, concepto: 'Diseño Interiores', valorTotal: 1200000, saldoPendiente: 1200000, fechaVencimiento: addDays(hoy, -10), estado: 'VENCIDO' as const },
    { clienteId: clientes[0].id, concepto: 'Tapicería', valorTotal: 650000, saldoPendiente: 650000, fechaVencimiento: addDays(hoy, -20), estado: 'VENCIDO' as const },
    { clienteId: clientes[1].id, concepto: 'Cortinas a Medida', valorTotal: 980000, saldoPendiente: 980000, fechaVencimiento: addDays(hoy, -28), estado: 'VENCIDO' as const },
    
    // CRITICO
    { clienteId: clientes[2].id, concepto: 'Mueble TV', valorTotal: 750000, saldoPendiente: 750000, fechaVencimiento: addDays(hoy, -45), estado: 'CRITICO' as const },
    { clienteId: clientes[3].id, concepto: 'Pisos Laminados', valorTotal: 1800000, saldoPendiente: 1800000, fechaVencimiento: addDays(hoy, -60), estado: 'CRITICO' as const },
    { clienteId: clientes[4].id, concepto: 'Fachada', valorTotal: 2100000, saldoPendiente: 2100000, fechaVencimiento: addDays(hoy, -90), estado: 'CRITICO' as const },
  ]

  await Promise.all(
    cuentasData.map(c => prisma.cuenta.create({ data: c }))
  )

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
