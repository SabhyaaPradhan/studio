
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '../ui/skeleton';

// Placeholder data based on the user request
const data = [
  { name: 'Opened', value: 850 },
  { name: 'Replied', value: 450 },
  { name: 'Bounced', value: 50 },
];
const totalSent = 1000;

const COLORS = {
    Opened: 'hsl(var(--primary))',
    Replied: 'hsl(var(--chart-2))',
    Bounced: 'hsl(var(--destructive))',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function EngagementRatesChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
            formatter={(value, name) => [`${((value / totalSent) * 100).toFixed(1)}% (${value})`, name]}
        />
        <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-muted-foreground">{value}</span>}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          innerRadius={60}
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function EngagementRatesChartSkeleton() {
    return <Skeleton className="h-full w-full" />;
}
