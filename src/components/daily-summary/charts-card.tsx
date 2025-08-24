
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

// Placeholder data
const messagesData = [
  { date: 'Mon', count: 32 }, { date: 'Tue', count: 45 }, { date: 'Wed', count: 28 },
  { date: 'Thu', count: 55 }, { date: 'Fri', count: 62 }, { date: 'Sat', count: 75 },
  { date: 'Sun', count: 88 },
];

const categoryData = [
  { name: 'Support', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Sales', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Marketing', value: 200, fill: 'hsl(var(--chart-3))' },
  { name: 'Other', value: 100, fill: 'hsl(var(--chart-4))' },
];

export function ChartsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Visual breakdown of messages and prompt usage.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 h-[300px]">
                <div>
                    <h3 className="text-sm font-medium mb-2 text-center">Messages Sent (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={messagesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--primary))' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#colorMessages)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                 <div>
                    <h3 className="text-sm font-medium mb-2 text-center">Prompt Categories Used</h3>
                    <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Pie>
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function ChartsCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
        </Card>
    );
}
