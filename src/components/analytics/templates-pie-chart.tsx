
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Placeholder data - replace with real data from your API
const data = [
  { name: 'Apology', value: 400 },
  { name: 'Order Update', value: 300 },
  { name: 'Refund Request', value: 300 },
  { name: 'Upsell', value: 200 },
  { name: 'Custom', value: 100 },
];

const COLORS = [
    'hsl(var(--primary))', 
    'hsl(var(--primary) / 0.8)', 
    'hsl(var(--primary) / 0.6)', 
    'hsl(var(--primary) / 0.4)',
    'hsl(var(--muted-foreground))'
];

export function TemplatesPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
