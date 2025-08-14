
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Skeleton } from '../ui/skeleton';

// Placeholder Data - replace with real data from your API
const data = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  // Simulate a weekly pattern
  Monday: Math.floor(Math.random() * 50) + (i > 8 && i < 18 ? 20 : 0),
  Tuesday: Math.floor(Math.random() * 50) + (i > 8 && i < 18 ? 30 : 0),
  Wednesday: Math.floor(Math.random() * 50) + (i > 8 && i < 18 ? 40 : 0),
  Thursday: Math.floor(Math.random() * 50) + (i > 8 && i < 18 ? 35 : 0),
  Friday: Math.floor(Math.random() * 50) + (i > 8 && i < 18 ? 25 : 0),
  Saturday: Math.floor(Math.random() * 20),
  Sunday: Math.floor(Math.random() * 15),
}));

export function PeakActivityHeatmap() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
        <YAxis 
            type="category" 
            dataKey="hour" 
            tick={{ fill: 'hsl(var(--muted-foreground))' }} 
            tickLine={false} 
            axisLine={false} 
            interval={2} 
        />
        <Tooltip
            cursor={{ fill: 'hsl(var(--secondary))' }}
            contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value, name) => [`${value} requests on ${name}`, null]}
        />
        <Bar dataKey="Monday" stackId="a" fill="hsl(var(--primary) / 0.2)" />
        <Bar dataKey="Tuesday" stackId="a" fill="hsl(var(--primary) / 0.3)" />
        <Bar dataKey="Wednesday" stackId="a" fill="hsl(var(--primary) / 0.4)" />
        <Bar dataKey="Thursday" stackId="a" fill="hsl(var(--primary) / 0.5)" />
        <Bar dataKey="Friday" stackId="a" fill="hsl(var(--primary) / 0.6)" />
        <Bar dataKey="Saturday" stackId="a" fill="hsl(var(--primary) / 0.7)" />
        <Bar dataKey="Sunday" stackId="a" fill="hsl(var(--primary) / 0.8)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PeakActivityHeatmapSkeleton() {
    return <Skeleton className="h-full w-full" />;
}
