
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Lightbulb } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { listenToAnalyticsDaily, DailyAnalytics } from "@/services/firestore-service";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";

export function AIConfidencePanel() {
    const { user } = useAuthContext();
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const unsubscribe = listenToAnalyticsDaily(user.uid, 7, (data) => {
                const processedData = data
                    .map(d => {
                        const totalConfidence = Object.entries(d.confidence_buckets || {}).reduce((acc, [bucket, count]) => {
                            const bucketMid = (parseFloat(bucket.split('-')[0]) + parseFloat(bucket.split('-')[1])) / 2;
                            return acc + (bucketMid * count);
                        }, 0);
                        const totalCount = Object.values(d.confidence_buckets || {}).reduce((a,b) => a+b, 0);
                        
                        return { 
                            date: format(new Date(d.date), 'MMM d'), 
                            avg_confidence: totalCount > 0 ? (totalConfidence / totalCount) * 100 : 0
                        };
                    })
                    .reverse();
                setChartData(processedData);
                setLoading(false);
            }, (err) => {
                console.error(err);
                setChartData([]);
                setLoading(false);
            });

            return () => unsubscribe();
        } else if (!user) {
            setLoading(false);
        }
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    AI Confidence Score
                </CardTitle>
                <CardDescription>
                    Average confidence of AI responses over the last 7 days.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-48">
                {loading ? (
                    <Skeleton className="h-full w-full" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                            <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                                formatter={(value: any) => [`${Math.round(value)}%`, "Avg. Confidence"]}
                            />
                            <Area type="monotone" dataKey="avg_confidence" stroke="hsl(var(--primary))" fill="url(#colorConfidence)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
