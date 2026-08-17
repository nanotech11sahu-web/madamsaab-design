import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface StatusPieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#ec2f77', '#1a2b6b', '#f6a5c4', '#16204a', '#fbbf24', '#94a3b8'];

export function StatusPieChart({ data }: StatusPieChartProps) {
  const nonZero = data.filter((d) => d.value > 0);

  return (
    <div className="rounded-card border border-brand-border bg-white p-5 shadow-card">
      <h2 className="text-sm font-bold text-brand-navy">Booking Status Breakdown</h2>
      {nonZero.length === 0 ? (
        <p className="mt-6 text-sm text-brand-navy/50">No bookings yet.</p>
      ) : (
        <div className="mt-2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={nonZero} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {nonZero.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, borderColor: '#f4d7e3', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
