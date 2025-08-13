
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';
import { ArrowRight, Bot, BrainCircuit, CalendarDays, DollarSign, Lightbulb, PlusCircle, Settings, MessageSquare, Newspaper, Bell, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { listenToUser, UserProfile } from '@/services/user-service';
import { format, subDays, differenceInDays, formatDistanceToNow } from 'date-fns';
import { listenToActivities, Activity } from '@/services/activity-service';
import { listenToAnalyticsDaily, listenToAnalyticsRealtime, DailyAnalytics, RealtimeAnalytics } from '@/services/firestore-service';

gsap.registerPlugin(ScrollTrigger);

const PIE_CHART_COLORS = ['#7CFC00', '#F5B700', '#00C49F', '#FF8042', '#FFBB28'];

const LoadingSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
    </div>
);

const ErrorDisplay = ({ error }: { error: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-destructive">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="font-semibold">Error loading data</p>
        <p className="text-sm text-center">{error}</p>
    </div>
);

const ChartEmptyState = () => (
    <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No data available yet.</p>
    </div>
);


export default function DashboardPage() {
    const { user } = useAuthContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [activities, setActivities] = useState<Activity[] | null>(null);
    const [dailyAnalytics, setDailyAnalytics] = useState<DailyAnalytics[]>([]);
    const [realtimeAnalytics, setRealtimeAnalytics] = useState<RealtimeAnalytics | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        let active = true;
        const unsubs: (() => void)[] = [];

        const dataStatus = {
            dailyAnalytics: false,
            realtimeAnalytics: false,
            userProfile: false,
            activities: false,
        };

        const checkCompletion = () => {
            if (active && Object.values(dataStatus).every(Boolean)) {
                setLoading(false);
            }
        };

        const handleError = (context: string, err: Error) => {
            if (active) {
                console.error(`Dashboard Error (${context}):`, err);
                setError(err.message || `Failed to fetch ${context} data.`);
                // Stop loading on first error
                setLoading(false);
            }
        };
        
        // Listen to User Profile
        unsubs.push(listenToUser(user.uid, (profile) => {
            if (active) {
                setUserProfile(profile);
                dataStatus.userProfile = true;
                checkCompletion();
            }
        }, (err) => handleError("user profile", err)));

        // Listen to Daily Analytics (last 7 days)
        unsubs.push(listenToAnalyticsDaily(user.uid, 7, (data) => {
            if (active) {
                setDailyAnalytics(data);
                dataStatus.dailyAnalytics = true;
                checkCompletion();
            }
        }, (err) => handleError("daily analytics", err)));

        // Listen to Realtime Analytics
        unsubs.push(listenToAnalyticsRealtime(user.uid, (data) => {
            if (active) {
                setRealtimeAnalytics(data);
                dataStatus.realtimeAnalytics = true;
                checkCompletion();
            }
        }, (err) => handleError("realtime analytics", err)));

        // Listen to Activities
        unsubs.push(listenToActivities(user.uid, (newActivities) => {
            if(active) {
                setActivities(newActivities);
                dataStatus.activities = true;
                checkCompletion();
            }
        }, (err) => handleError("activities", err)));

        return () => {
            active = false;
            unsubs.forEach(unsub => unsub());
        };
    }, [user]);

    useEffect(() => {
        if (loading || error) return;
        const ctx = gsap.context(() => {
            // Animations can be re-enabled here if desired
        }, containerRef);
        return () => ctx.revert();
    }, [loading, error]);

    const getTrialDaysLeft = () => {
        if (userProfile?.trial_end_date) {
            const trialEnd = new Date(userProfile.trial_end_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const days = differenceInDays(trialEnd, today);
            return days >= 0 ? `${days} day(s)` : 'Ended';
        }
        return 'N/A';
    };

    // Chart Data Preparation
    const lineChartData = dailyAnalytics
        .map(d => ({ date: format(new Date(d.date + 'T00:00:00Z'), 'MMM d'), replies: d.assistant_messages }))
        .reverse();

    const formattedPieData = Object.entries(
        dailyAnalytics.reduce((acc, day) => {
            for (const [category, count] of Object.entries(day.by_category || {})) {
                acc[category] = (acc[category] || 0) + count;
            }
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));
    
    // Data for Scatter Plot
    const confidenceScatterData = dailyAnalytics.flatMap(day => 
        Object.entries(day.confidence_buckets || {}).map(([bucket, count]) => {
            const bucketMidpoint = (parseFloat(bucket.split('-')[0]) + parseFloat(bucket.split('-')[1])) / 2;
            return {
                x: new Date(day.date + 'T00:00:00Z').getTime(),
                y: bucketMidpoint,
                z: count
            };
        })
    );


    const stats = userProfile ? [
        { title: "AI Replies Today", value: realtimeAnalytics?.today_assistant_messages ?? 0, icon: Bot, change: "vs yesterday", link: "/chat", linkText: "View Chats" },
        { title: "Plan", value: userProfile.plan ? userProfile.plan.charAt(0).toUpperCase() + userProfile.plan.slice(1) : "Free", icon: DollarSign, change: "Manage your subscription", link: "/billing", linkText: "Upgrade" },
        { title: "Knowledge Sources", value: 0, icon: BrainCircuit, change: "Manage sources", link: "/content-management", linkText: "Manage" }, // Placeholder
        { title: "Trial Ends In", value: getTrialDaysLeft(), icon: CalendarDays, change: `Ends on ${userProfile.trial_end_date ? format(new Date(userProfile.trial_end_date), 'MMM d, yyyy') : 'N/A'}`, link: "/billing", linkText: "View Plans" }
    ] : [];

    if (loading) {
        return (
            <div className="flex-1 space-y-12 p-4 pt-6 md:p-8">
                 <div className="space-y-2">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => <Card key={i}><CardContent className="p-6"><LoadingSkeleton /></CardContent></Card>)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2"><CardContent className="p-6 h-96"><Skeleton className="h-full w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6 h-96"><Skeleton className="h-full w-full" /></CardContent></Card>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen"><ErrorDisplay error={error} /></div>;
    }

    return (
        <div ref={containerRef} className="flex-1 space-y-12 p-4 pt-6 md:p-8">
            <div className="space-y-2">
                <h2 data-animate="welcome-title" className="text-3xl md:text-4xl font-bold tracking-tight">
                    Welcome back, <span className="text-primary">{userProfile?.first_name || user?.displayName?.split(' ')[0] || 'User'}</span>!
                </h2>
                <p data-animate="welcome-desc" className="text-lg text-muted-foreground">Here’s your account overview for today.</p>
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} data-animate="stat-card" className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                            <Button variant="link" asChild className="p-0 h-auto mt-2 text-primary">
                                <Link href={stat.link}><span className="text-sm">{stat.linkText}</span><ArrowRight className="h-4 w-4 ml-1" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <Card data-animate="chart-card" className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>AI Replies Last 7 Days</CardTitle>
                        <CardDescription>Assistant messages sent per day.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        {lineChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
                                        formatter={(value: any) => [`${value} replies`, null]}
                                    />
                                    <Area type="monotone" dataKey="replies" stroke="hsl(var(--primary))" fill="url(#colorReplies)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                           <ChartEmptyState />
                        )}
                    </CardContent>
                </Card>
                 <Card data-animate="activity-card">
                    <CardHeader>
                        <CardTitle>Activity Feed</CardTitle>
                        <CardDescription>A log of recent account activities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 activity-feed">
                            {activities && activities.length > 0 ? (
                                activities.map((item) => (
                                    <li key={item.id} className="flex items-start gap-4 activity-item">
                                        <div className="p-2 bg-secondary rounded-full">
                                            <item.icon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm">{item.text}</p>
                                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(item.timestamp, { addSuffix: true })}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-sm text-center pt-8">No recent activity.</p>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card data-animate="pie-chart-card">
                    <CardHeader>
                        <CardTitle>Usage Breakdown</CardTitle>
                        <CardDescription>Proportion of queries by category.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      {formattedPieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={formattedPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                    {formattedPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} queries`, name]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                      ) : (
                       <ChartEmptyState />
                      )}
                    </CardContent>
                </Card>

                 <Card data-animate="heatmap-card">
                    <CardHeader>
                        <CardTitle>AI Confidence Score</CardTitle>
                        <CardDescription>Confidence levels for responses over time.</CardDescription>
                    </CardHeader>
                     <CardContent className="h-80">
                        {confidenceScatterData.length > 0 ? (
                             <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        type="number" 
                                        dataKey="x" 
                                        name="date"
                                        domain={['dataMin', 'dataMax']}
                                        tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM d')}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                                        tickLine={false} 
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        type="number" 
                                        dataKey="y" 
                                        name="confidence" 
                                        domain={[0, 1]}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                                        tickLine={false} 
                                        axisLine={false}
                                    />
                                    <ZAxis type="number" dataKey="z" range={[50, 500]} name="count" />
                                    <Tooltip 
                                        cursor={{ strokeDasharray: '3 3' }} 
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: 'var(--radius)',
                                        }}
                                        formatter={(value: any, name: string) => {
                                            if (name === 'date') return format(new Date(value), 'MMM d, yyyy');
                                            if (name === 'confidence') return value.toFixed(2);
                                            return value;
                                        }}
                                    />
                                    <Legend />
                                    <Scatter name="Confidence Buckets" data={confidenceScatterData} fill="hsl(var(--primary))" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        ) : (
                            <ChartEmptyState />
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card data-animate="quick-actions-card">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Get started with common tasks.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button variant="outline" asChild><Link href="/chat"><Bot className="mr-2 h-4 w-4" />Ask AI</Link></Button>
                        <Button variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" />Add Knowledge
                        </Button>
                        <Button variant="outline" asChild><Link href="/billing"><DollarSign className="mr-2 h-4 w-4" />Upgrade Plan</Link></Button>
                        <Button variant="outline" asChild><Link href="/settings"><Settings className="mr-2 h-4 w-4" />Account Settings</Link></Button>
                    </CardContent>
                </Card>

                 <Card data-animate="announcements-card">
                    <CardHeader>
                        <CardTitle>Announcements & Tips</CardTitle>
                        <CardDescription>Latest updates and helpful guides.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Accordion type="single" collapsible className="w-full">
                           <AccordionItem value="item-1">
                               <AccordionTrigger>
                                   <div className='flex items-center gap-2'>
                                       <Newspaper className="h-4 w-4 text-primary" />
                                       New Feature: Real-time Analytics!
                                   </div>
                               </AccordionTrigger>
                               <AccordionContent className="text-muted-foreground">
                                   Enterprise users can now access real-time analytics for deeper insights into customer interactions. Check it out in the new 'Analytics' tab.
                               </AccordionContent>
                           </AccordionItem>
                            <AccordionItem value="item-2">
                               <AccordionTrigger>
                                   <div className='flex items-center gap-2'>
                                       <Lightbulb className="h-4 w-4 text-primary" />
                                        Tip of the Week: Train Your Brand Voice
                                   </div>
                               </AccordionTrigger>
                               <AccordionContent className="text-muted-foreground">
                                   Improve AI consistency by training it on your brand's unique tone. Upload examples of your communication style in the 'Brand Voice' section.
                               </AccordionContent>
                           </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
