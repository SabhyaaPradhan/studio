
'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { Mail } from 'lucide-react';

interface DailyGmailReplies {
    date: string;
    count: number;
}

interface GmailRepliesChartProps {
  data: DailyGmailReplies[];
}

export function GmailRepliesChart({ data }: GmailRepliesChartProps) {
    const chartData = data
        .map(d => ({
            date: format(new Date(d.date), 'MMM d'),
            count: d.count,
        }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorGmail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.7} />
            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
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
          itemStyle={{ color: 'hsl(var(--destructive))', fontWeight: 'bold' }}
          formatter={(value: any, name: string) => [`${value} replies`, "Gmail"]}
          labelFormatter={(label) => `On ${label}`}
        />
        <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            iconSize={10}
            formatter={(value, entry) => <span className="text-muted-foreground">{value}</span>}
        />
        <Area type="monotone" dataKey="count" name="Gmail Replies" stroke="hsl(var(--destructive))" fill="url(#colorGmail)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function GmailRepliesChartSkeleton() {
    return <Skeleton className="h-full w-full" />;
}
