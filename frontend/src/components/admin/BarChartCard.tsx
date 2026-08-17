import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface BarChartCardProps {
  title: string;
  data: { name: string; count: number }[];
  emptyLabel?: string;
}

export function BarChartCard({ title, data, emptyLabel = 'No data yet.' }: BarChartCardProps) {
  return (
    <div className="rounded-card border border-brand-border bg-white p-5 shadow-card">
      <h2 className="text-sm font-bold text-brand-navy">{title}</h2>
      {data.length === 0 ? (
        <p className="mt-6 text-sm text-brand-navy/50">{emptyLabel}</p>
      ) : (
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4d7e3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#1a1b47' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 11, fill: '#1a1b47' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#fdf3f7' }}
                contentStyle={{ borderRadius: 10, borderColor: '#f4d7e3', fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#ec2f77" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
