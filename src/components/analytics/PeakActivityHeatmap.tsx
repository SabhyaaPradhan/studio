
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Skeleton } from '../ui/skeleton';
import { listenToRecentRepliesForHeatmap, AiGeneratedReply } from '@/services/firestore-service';
import { useEffect, useState } from 'react';
import { format, getDay, getHours } from 'date-fns';
import { Info } from 'lucide-react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const processDataForHeatmap = (replies: AiGeneratedReply[]) => {
    // Initialize a 7x24 grid with zeros
    const heatmapData: { [key: string]: { [hour: number]: number } } = {};
    daysOfWeek.forEach(day => {
        heatmapData[day] = {};
        for (let hour = 0; hour < 24; hour++) {
            heatmapData[day][hour] = 0;
        }
    });

    replies.forEach(reply => {
        const date = reply.createdAt.toDate();
        const dayIndex = getDay(date); // 0 for Sunday, 1 for Monday, etc.
        const dayName = daysOfWeek[dayIndex];
        const hour = getHours(date);

        if (heatmapData[dayName] && heatmapData[dayName][hour] !== undefined) {
            heatmapData[dayName][hour]++;
        }
    });
    
    // Transform data for Recharts (one bar per hour)
    const chartData = [];
    for (let hour = 0; hour < 24; hour++) {
        const hourData: { hour: string, [key: string]: string | number } = { hour: `${hour.toString().padStart(2, '0')}:00` };
        daysOfWeek.forEach(day => {
            hourData[day] = heatmapData[day][hour];
        });
        chartData.push(hourData);
    }
    return chartData;
};

interface PeakActivityHeatmapProps {
    userId?: string;
}

export function PeakActivityHeatmap({ userId }: PeakActivityHeatmapProps) {
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            const unsubscribe = listenToRecentRepliesForHeatmap(userId, 7, (replies) => {
                const processedData = processDataForHeatmap(replies);
                setHeatmapData(processedData);
                setLoading(false);
            }, (error) => {
                console.error("Failed to fetch replies for heatmap:", error);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [userId]);

    if (loading) {
        return <PeakActivityHeatmapSkeleton />;
    }

    if (heatmapData.length === 0) {
        return (
             <div className="h-full w-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <Info className="w-8 h-8 mb-4" />
                <p className="font-medium">No Activity Data</p>
                <p className="text-sm">AI replies in the last 7 days will appear here.</p>
            </div>
        );
    }
    
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={heatmapData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barCategoryGap="10%">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} allowDecimals={false} />
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
            formatter={(value, name) => [`${value} replies on ${name}`, null]}
        />
        <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px' }}
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-muted-foreground text-xs">{value}</span>}
        />
        <Bar dataKey="Sun" stackId="a" fill="hsl(var(--primary) / 0.2)" radius={[4, 4, 4, 4]} />
        <Bar dataKey="Mon" stackId="a" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 4, 4]} />
        <Bar dataKey="Tue" stackId="a" fill="hsl(var(--primary) / 0.4)" radius={[4, 4, 4, 4]} />
        <Bar dataKey="Wed" stackId="a" fill="hsl(var(--primary) / 0.5)" radius={[4, 4, 4, 4]} />
        <Bar dataKey="Thu" stackId="a" fill="hsl(var(--primary) / 0.6)" radius={[4, 4, 4, 4]} />
        <Bar dataKey="Fri" stackId="a" fill="hsl(var(--primary) / 0.8)" radius={[4, 4, 4, 4]} />
        <Bar dataKey="Sat" stackId="a" fill="hsl(var(--primary) / 1.0)" radius={[4, 4, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PeakActivityHeatmapSkeleton() {
    return <Skeleton className="h-full w-full" />;
}
