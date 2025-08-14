
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Lightbulb } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { listenToChatMessages, ChatMessage } from "@/services/firestore-service";
import { useState, useEffect } from "react";
import { format, startOfDay, subDays, isAfter } from "date-fns";
import { Skeleton } from "../ui/skeleton";

interface DailyConfidence {
    date: string;
    avg_confidence: number;
}

export function AIConfidencePanel() {
    const { user } = useAuthContext();
    const [chartData, setChartData] = useState<DailyConfidence[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const unsubscribe = listenToChatMessages(user.uid, (messages) => {
                const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
                const dailyData: { [key: string]: { totalConfidence: number; count: number } } = {};

                // Initialize daily data for the last 7 days
                for (let i = 0; i < 7; i++) {
                    const date = startOfDay(subDays(new Date(), i));
                    const dateKey = format(date, 'yyyy-MM-dd');
                    dailyData[dateKey] = { totalConfidence: 0, count: 0 };
                }

                const aiMessages = messages.filter(msg => 
                    msg.role === 'model' && 
                    isAfter(new Date(msg.createdAt), sevenDaysAgo) &&
                    msg.confidence !== undefined
                );

                aiMessages.forEach(msg => {
                    const msgDate = startOfDay(new Date(msg.createdAt));
                    const dateKey = format(msgDate, 'yyyy-MM-dd');
                    if (dailyData[dateKey]) {
                        dailyData[dateKey].totalConfidence += msg.confidence!;
                        dailyData[dateKey].count += 1;
                    }
                });

                const processedData: DailyConfidence[] = Object.entries(dailyData).map(([date, data]) => ({
                    date: format(new Date(date), 'MMM d'),
                    avg_confidence: data.count > 0 ? (data.totalConfidence / data.count) * 100 : 0,
                })).reverse();
                
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
