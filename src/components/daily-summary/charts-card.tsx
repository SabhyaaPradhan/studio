
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import type { DailyAnalytics } from '@/services/firestore-service';
import { format } from 'date-fns';

interface ChartsCardProps {
    dailyData: DailyAnalytics[];
}

export function ChartsCard({ dailyData }: ChartsCardProps) {
    const messagesData = dailyData.map(d => ({
        date: format(new Date(d.date), 'MMM d'),
        count: d.assistant_messages || 0,
    })).reverse();

    const categoryData = Object.entries(
        dailyData.reduce((acc, day) => {
            Object.entries(day.by_category || {}).forEach(([cat, count]) => {
                acc[cat] = (acc[cat] || 0) + count;
            });
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value], index) => ({
        name,
        value,
        fill: `hsl(var(--chart-${(index % 5) + 1}))`
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Visual breakdown of messages and prompt usage.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="grid gap-6 md:grid-cols-2 h-full">
                <div>
                    <h3 className="text-sm font-medium mb-2 text-center">AI Messages Sent</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={messagesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
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
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="40%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Pie>
                            <Legend wrapperStyle={{top: "85%"}} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
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
