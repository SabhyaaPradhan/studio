
'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';
import { ArrowRight, Bot, BrainCircuit, CalendarDays, DollarSign, Lightbulb, PlusCircle, Settings, MessageSquare, Newspaper, Bell } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

gsap.registerPlugin(ScrollTrigger);

const chartData = [
  { date: 'Mon', replies: 32 },
  { date: 'Tue', replies: 45 },
  { date: 'Wed', replies: 28 },
  { date: 'Thu', replies: 55 },
  { date: 'Fri', replies: 62 },
  { date: 'Sat', replies: 75 },
  { date: 'Sun', replies: 88 },
];

const pieChartData = [
    { name: 'General', value: 400 },
    { name: 'E-commerce', value: 300 },
    { name: 'Coaching', value: 300 },
    { name: 'SaaS Support', value: 200 },
];

const PIE_CHART_COLORS = ['#7CFC00', '#F5B700', '#00C49F', '#FF8042'];

const confidenceData = [
  { day: 'Mon', confidence: 92, count: 10 },
  { day: 'Tue', confidence: 85, count: 15 },
  { day: 'Wed', confidence: 78, count: 8 },
  { day: 'Thu', confidence: 95, count: 20 },
  { day: 'Fri', confidence: 88, count: 25 },
  { day: 'Sat', confidence: 91, count: 30 },
  { day: 'Sun', confidence: 96, count: 35 },
];


const activityFeed = [
    { icon: MessageSquare, text: "New AI reply generated to 'hello@example.com'", time: "2m ago" },
    { icon: BrainCircuit, text: "Knowledge source 'Product FAQ.pdf' was added", time: "1h ago" },
    { icon: Settings, text: "Your profile information was updated", time: "3h ago" },
    { icon: DollarSign, text: "Your plan has been upgraded to 'Pro'", time: "1d ago" },
];

const announcements = [
    { title: "🚀 New Feature: Real-time Analytics!", content: "Enterprise users can now access real-time analytics for deeper insights into customer interactions. Check it out in the new 'Analytics' tab." },
    { title: "💡 Tip of the Week: Train Your Brand Voice", content: "Improve AI consistency by training it on your brand's unique tone. Upload examples of your communication style in the 'Brand Voice' section." }
]


export default function DashboardPage() {
    const { user } = useAuthContext();
    const containerRef = useRef<HTMLDivElement>(null);

    const stats = [
        { title: "AI Replies Today", value: 45, icon: Bot, change: "+5 from yesterday", link: "#", linkText: "View Details" },
        { title: "Plan", value: "Free", icon: DollarSign, change: "Upgrade to Pro", link: "/billing", linkText: "Upgrade" },
        { title: "Knowledge Sources", value: 1, icon: BrainCircuit, change: "+0 this week", link: "#", linkText: "Manage" },
        { title: "Trial Ends In", value: "N/A", icon: CalendarDays, change: "", link: "/home", linkText: "View Full Dashboard" }
    ];

    useEffect(() => {
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
    }, []);

    return (
        <div ref={containerRef} className="flex-1 space-y-12 p-4 pt-6 md:p-8">
            <div className="space-y-2">
                <h2 data-animate="welcome-title" className="text-3xl md:text-4xl font-bold tracking-tight">
                    Welcome back, <span className="text-primary">{user?.displayName?.split(' ')[0] || 'Sabhyaa Pradhan'}</span>!
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
                        <CardDescription>Monitor AI engagement to track performance.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                            {activityFeed.map((item, index) => (
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
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                 <Card data-animate="heatmap-card">
                    <CardHeader>
                        <CardTitle>AI Confidence Score</CardTitle>
                        <CardDescription>Confidence levels for responses over time.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <YAxis type="number" dataKey="confidence" name="confidence" unit="%" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <ZAxis type="number" dataKey="count" range={[60, 400]} name="queries" unit="q" />
                                <Tooltip 
                                    cursor={{ strokeDasharray: '3 3' }} 
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                    }}
                                />
                                <Scatter name="Confidence Scores" data={confidenceData} fill="hsl(var(--primary))" />
                            </ScatterChart>
                        </ResponsiveContainer>
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
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />Add Knowledge</Button>
                        <Button variant="outline"><DollarSign className="mr-2 h-4 w-4" />Upgrade Plan</Button>
                        <Button variant="outline"><Settings className="mr-2 h-4 w-4" />Account Settings</Button>
                    </CardContent>
                </Card>

                 <Card data-animate="announcements-card">
                    <CardHeader>
                        <CardTitle>Announcements & Tips</CardTitle>
                        <CardDescription>Latest updates and helpful guides.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Accordion type="single" collapsible className="w-full">
                           {announcements.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className='flex items-center gap-2'>
                                            {index === 0 ? <Newspaper className="h-4 w-4 text-primary" /> : <Lightbulb className="h-4 w-4 text-primary" />}
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
