"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { formatCOP } from '@/lib/formatCOP'

interface Props {
  monthlyData: any[]
  statusData: any[]
}

const COLORS = {
  AL_DIA: '#22c55e',
  EN_RIESGO: '#eab308',
  VENCIDO: '#f97316',
  CRITICO: '#ef4444'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-4 rounded-xl border border-[var(--border)] shadow-xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
            {entry.name}: {formatCOP(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export const DashboardCharts = ({ monthlyData, statusData }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-8">
      {/* Bar Chart */}
      <div className="glass p-6 rounded-2xl w-full lg:w-[65%] border-[var(--border)]">
        <h3 className="text-lg font-heading font-bold text-white mb-6">Cartera por mes — últimos 6 meses</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000000}M`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="saldo" name="Saldo Total" fill="var(--accent-from)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cobrado" name="Cobrado" fill="var(--accent-to)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="glass p-6 rounded-2xl w-full lg:w-[35%] border-[var(--border)]">
        <h3 className="text-lg font-heading font-bold text-white mb-6">Estado actual de cartera</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass p-3 rounded-xl border border-[var(--border)] shadow-xl">
                        <p className="font-bold text-white">{payload[0].name}</p>
                        <p className="text-sm text-[var(--text-muted)]">{formatCOP(payload[0].value as number)}</p>
                      </div>
                    )
                  }
                  return null
                }} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
