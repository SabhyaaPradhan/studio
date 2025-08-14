
'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

interface DailyAnalytics {
    id: string;
    date: string;
    assistant_messages?: number;
}

interface DailyUsageChartProps {
  data: DailyAnalytics[];
}

export function DailyUsageChart({ data }: DailyUsageChartProps) {
    const chartData = data
        .map(d => ({
            date: format(new Date(d.date), 'MMM d'),
            responses: d.assistant_messages || 0,
        }))
        .reverse();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
          formatter={(value: any) => [`${value} responses`, null]}
        />
        <Area type="monotone" dataKey="responses" stroke="hsl(var(--primary))" fill="url(#colorUsage)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DailyUsageChartSkeleton() {
    return <Skeleton className="h-full w-full" />;
}
