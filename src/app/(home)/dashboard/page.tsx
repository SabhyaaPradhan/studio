
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
import { getDashboardData, DashboardData } from '@/services/dashboard-service';
import { Skeleton } from '@/components/ui/skeleton';
import { listenToGraphs, Graph, addGraph } from '@/services/firestore-service';
import { listenToUser, UserProfile } from '@/services/user-service';
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';


gsap.registerPlugin(ScrollTrigger);

const PIE_CHART_COLORS = ['#7CFC00', '#F5B700', '#00C49F', '#FF8042'];

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

export default function DashboardPage() {
    const { user } = useAuthContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const [graphs, setGraphs] = useState<Graph[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [staticData, setStaticData] = useState<Omit<DashboardData, 'stats' | 'charts'> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const unsubscribers = [
            listenToGraphs(user.uid, (newGraphs) => {
                setGraphs(newGraphs);
                if (loading) setLoading(false);
            }),
            listenToUser(user.uid, (profile) => {
                setUserProfile(profile);
                if (loading) setLoading(false);
            })
        ];

        const fetchStaticData = async () => {
            try {
                const result = await getDashboardData();
                setStaticData(result);
            } catch (err: any) {
                setError(err.message || "Failed to fetch dashboard data.");
            }
        };

        fetchStaticData();
        
        return () => unsubscribers.forEach(unsub => unsub());
    }, [user, loading]);
    

    useEffect(() => {
        if (loading || !staticData) return;

        const ctx = gsap.context(() => {
            gsap.from("[data-animate='welcome-title']", { duration: 0.8, y: 30, opacity: 0, ease: 'power3.out', delay: 0.2 });
            gsap.from("[data-animate='welcome-desc']", { duration: 0.8, y: 30, opacity: 0, ease: 'power3.out', delay: 0.4 });
            
            gsap.utils.toArray<HTMLDivElement>("[data-animate='stat-card']").forEach((card, i) => {
                gsap.from(card, {
                    duration: 0.8,
                    y: 50,
                    opacity: 0,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: card, start: 'top 90%' },
                    delay: i * 0.1
                });
            });

             gsap.from("[data-animate='chart-card']", { duration: 1, y: 50, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: "[data-animate='chart-card']", start: 'top 85%' }});
             gsap.from("[data-animate='activity-card']", { duration: 1, y: 50, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: "[data-animate='activity-card']", start: 'top 85%' }});
             gsap.from("[data-animate='quick-actions-card']", { duration: 1, y: 50, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: "[data-animate='quick-actions-card']", start: 'top 85%' }});
             gsap.from("[data-animate='announcements-card']", { duration: 1, y: 50, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: "[data-animate='announcements-card']", start: 'top 85%' }});
             gsap.from("[data-animate='pie-chart-card']", { duration: 1, y: 50, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: "[data-animate='pie-chart-card']", start: 'top 85%' }});
             gsap.from("[data-animate='heatmap-card']", { duration: 1, y: 50, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: "[data-animate='heatmap-card']", start: 'top 85%' }});
            
             gsap.from(".activity-item", {
                duration: 0.5,
                x: -30,
                opacity: 0,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: ".activity-feed",
                    start: "top 85%"
                }
            });

        }, containerRef);
        return () => ctx.revert();
    }, [loading, staticData]);

    const getTrialDaysLeft = () => {
        if (userProfile?.trial_end_date) {
            const days = differenceInDays(new Date(userProfile.trial_end_date), new Date());
            return days > 0 ? `${days} days` : 'Ended';
        }
        return 'N/A';
    }
    
    const chartDataFromGraphs = graphs.map(g => ({
        date: format(g.createdAt.toDate(), 'MMM d'),
        replies: g.data?.points?.length || 0
    })).slice(-7);


    const stats = userProfile ? [
        { title: "AI Replies Today", value: "N/A", icon: Bot, change: "Data not available", link: "#", linkText: "View Details" },
        { title: "Plan", value: userProfile.plan.charAt(0).toUpperCase() + userProfile.plan.slice(1), icon: DollarSign, change: "Manage your subscription", link: "/billing", linkText: "Upgrade" },
        { title: "Knowledge Sources", value: graphs.length, icon: BrainCircuit, change: "+0 this week", link: "#", linkText: "Manage" },
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
        )
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen"><ErrorDisplay error={error} /></div>
    }

    if (!staticData || !userProfile) {
        return <div className="flex items-center justify-center h-screen"><p>No data available.</p></div>
    }

    return (
        <div ref={containerRef} className="flex-1 space-y-12 p-4 pt-6 md:p-8">
            <div className="space-y-2">
                <h2 data-animate="welcome-title" className="text-3xl md:text-4xl font-bold tracking-tight">
                    Welcome back, <span className="text-primary">{userProfile.first_name || 'User'}</span>!
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
                        <CardDescription>Based on your graph data points.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartDataFromGraphs} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
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
                    </CardContent>
                </Card>
                 <Card data-animate="activity-card">
                    <CardHeader>
                        <CardTitle>Activity Feed</CardTitle>
                        <CardDescription>A log of recent account activities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 activity-feed">
                            {staticData.activityFeed.map((item, index) => (
                                <li key={index} className="flex items-start gap-4 activity-item">
                                    <div className="p-2 bg-secondary rounded-full">
                                        <item.icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm">{item.text}</p>
                                        <p className="text-xs text-muted-foreground">{item.time}</p>
                                    </div>
                                </li>
                            ))}
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
                       <p className="text-muted-foreground text-center pt-16">Chart data not available.</p>
                    </CardContent>
                </Card>

                 <Card data-animate="heatmap-card">
                    <CardHeader>
                        <CardTitle>AI Confidence Score</CardTitle>
                        <CardDescription>Confidence levels for responses over time.</CardDescription>
                    </CardHeader>
                     <CardContent className="h-80">
                        <p className="text-muted-foreground text-center pt-16">Chart data not available.</p>
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
                        <Button variant="outline"><Bot className="mr-2 h-4 w-4" />Ask AI</Button>
                        <Button variant="outline" onClick={() => user && addGraph(user.uid, `New Graph #${graphs.length + 1}`, { points: [] })}>
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
                           {staticData.announcements.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className='flex items-center gap-2'>
                                            {item.type === 'feature' ? <Newspaper className="h-4 w-4 text-primary" /> : <Lightbulb className="h-4 w-4 text-primary" />}
                                            {item.title}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {item.content}
                                    </AccordionContent>
                                </AccordionItem>
                           ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
