
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '../ui/skeleton';
import { listenToEmailStats, EmailStats } from '@/services/firestore-service';
import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

const COLORS = {
    Opened: 'hsl(var(--primary))',
    Replied: 'hsl(var(--chart-2))',
    Bounced: 'hsl(var(--destructive))',
    Unopened: 'hsl(var(--muted))',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
    if (percent < 0.05) return null; // Don't render labels for small slices
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

interface EngagementRatesChartProps {
    userId?: string;
}

export function EngagementRatesChart({ userId }: EngagementRatesChartProps) {
    const [stats, setStats] = useState<EmailStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            const unsubscribe = listenToEmailStats(userId, (data) => {
                setStats(data);
                setLoading(false);
            }, (error) => {
                console.error("Failed to load email stats:", error);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [userId]);

    if (loading) {
        return <EngagementRatesChartSkeleton />;
    }

    if (!stats || stats.sent === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <Info className="w-8 h-8 mb-4" />
                <p className="font-medium">No Email Engagement Data</p>
                <p className="text-sm">Connect an email integration and send messages to see stats.</p>
            </div>
        );
    }

    const data = [
      { name: 'Opened', value: stats.opened - stats.replied }, // Opened but not replied
      { name: 'Replied', value: stats.replied },
      { name: 'Bounced', value: stats.bounced },
      { name: 'Unopened', value: stats.sent - stats.opened - stats.bounced },
    ].filter(d => d.value > 0);

    const totalSent = stats.sent;

    return (
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
                formatter={(value, name) => [`${((Number(value) / totalSent) * 100).toFixed(1)}% (${value})`, name]}
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
