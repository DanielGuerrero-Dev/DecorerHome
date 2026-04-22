import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { KPICard } from "@/components/dashboard/KPICard"
import { DashboardCharts } from "@/components/dashboard/DashboardCharts"
import { DollarSign, AlertTriangle, Users, TrendingUp } from "lucide-react"
import { formatCOP } from "@/lib/formatCOP"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Revalidate this page dynamically so data is fresh
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  // Session is guaranteed by layout
  
  // 1. Cartera Total
  const carteraTotalObj = await prisma.cuenta.aggregate({ _sum: { saldoPendiente: true } })
  const carteraTotal = carteraTotalObj._sum.saldoPendiente || 0

  // 2. Cuentas Críticas
  const criticas = await prisma.cuenta.count({ where: { estado: 'CRITICO' } })
  
  // 3. Clientes en mora
  const clientesMora = await prisma.cliente.count({
    where: { cuentas: { some: { estado: { in: ['VENCIDO', 'CRITICO'] } } } }
  })

  // 4. Cobros este mes
  const firstDay = new Date()
  firstDay.setDate(1)
  firstDay.setHours(0,0,0,0)
  
  const cobrosMesObj = await prisma.pago.aggregate({
    _sum: { monto: true },
    where: { fecha: { gte: firstDay } }
  })
  const cobrosMes = cobrosMesObj._sum.monto || 0

  // Chart 2: Estado actual de cartera
  const estadoGrupos = await prisma.cuenta.groupBy({
    by: ['estado'],
    _sum: { saldoPendiente: true }
  })
  
  const statusData = estadoGrupos.map(g => ({
    name: g.estado,
    value: g._sum.saldoPendiente || 0
  })).filter(g => g.value > 0)

  // Chart 1: Cartera por mes (Simulación combinada con datos reales actuales)
  const currentMonthName = format(new Date(), "MMM", { locale: es })
  const monthlyData = [
    { name: 'Nov', saldo: 15000000, cobrado: 5000000 },
    { name: 'Dic', saldo: 18000000, cobrado: 7000000 },
    { name: 'Ene', saldo: 16000000, cobrado: 8000000 },
    { name: 'Feb', saldo: 14000000, cobrado: 9000000 },
    { name: 'Mar', saldo: 12000000, cobrado: 10000000 },
    { name: currentMonthName, saldo: carteraTotal, cobrado: cobrosMes } // actual
  ]

  // Tabla: Últimos 8 movimientos
  const ultimosPagos = await prisma.pago.findMany({
    take: 8,
    orderBy: { fecha: 'desc' },
    include: { cuenta: { include: { cliente: true } } }
  })

  return (
    <div className="flex flex-col gap-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Cartera Total" 
          value={formatCOP(carteraTotal)} 
          icon={<DollarSign size={24} />} 
        />
        <KPICard 
          title="Cuentas Críticas" 
          value={criticas} 
          icon={<AlertTriangle size={24} />} 
          danger 
        />
        <KPICard 
          title="Clientes en Mora" 
          value={clientesMora} 
          icon={<Users size={24} />} 
          danger 
        />
        <KPICard 
          title="Cobros Este Mes" 
          value={formatCOP(cobrosMes)} 
          icon={<TrendingUp size={24} />} 
        />
      </div>

      {/* Gráficas */}
      <DashboardCharts monthlyData={monthlyData} statusData={statusData} />

      {/* Tabla Reciente */}
      <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-heading font-bold text-white">Últimos movimientos de pagos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-muted)]">
            <thead className="bg-white/5 text-xs uppercase text-[var(--text-muted)] font-semibold border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Concepto</th>
                <th className="px-6 py-4">Monto Cobrado</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {ultimosPagos.length > 0 ? (
                ultimosPagos.map((pago) => (
                  <tr key={pago.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                      {pago.cuenta.cliente.nombre}
                    </td>
                    <td className="px-6 py-4">{pago.cuenta.concepto}</td>
                    <td className="px-6 py-4 font-bold text-green-400">
                      + {formatCOP(pago.monto)}
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(pago.fecha), "dd MMM yyyy, p", { locale: es })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-muted)]">
                    No hay movimientos recientes en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
