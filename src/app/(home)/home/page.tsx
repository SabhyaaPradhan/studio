
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';
import { useSubscription } from '@/context/subscription-context';
import { differenceInDays, isPast } from 'date-fns';
import { BrainCircuit, CalendarDays, DollarSign, MessageSquare, ArrowRight, Lightbulb, UserCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RecentActivity } from '@/components/home/recent-activity';
import { listenToAnalyticsRealtime, RealtimeAnalytics } from '@/services/firestore-service';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
    const { user } = useAuthContext();
    const { subscription, loading: subLoading } = useSubscription();
    const containerRef = useRef<HTMLDivElement>(null);
    const [realtimeStats, setRealtimeStats] = useState<RealtimeAnalytics | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setStatsLoading(true);
            const unsubscribe = listenToAnalyticsRealtime(user.uid, (data) => {
                setRealtimeStats(data);
                setStatsLoading(false);
            }, (error) => {
                console.error("Failed to load realtime stats:", error);
                setStatsLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const getTrialDaysLeft = () => {
        if (subLoading || !subscription) return "...";
        if (subscription.status !== 'trialing') return "N/A";
        
        const trialEndDate = new Date(subscription.trialEnd);
        if (isPast(trialEndDate)) return "Expired";
        
        const daysLeft = differenceInDays(trialEndDate, new Date());
        return `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
    }

    const stats = [
        { 
            title: "AI Replies Today", 
            value: statsLoading ? -1 : (realtimeStats?.today_assistant_messages ?? 0), 
            icon: MessageSquare, 
            change: "Total replies generated today", 
            link: "/dashboard", 
            linkText: "View Details" 
        },
        { 
            title: "Plan", 
            value: subLoading ? "..." : (subscription?.plan ?? 'starter'), 
            icon: DollarSign, 
            change: "Upgrade to Pro", 
            link: "/billing", 
            linkText: "Upgrade" 
        },
        { 
            title: "Knowledge Sources", 
            value: 1, 
            icon: BrainCircuit, 
            change: "+0 this week", 
            link: "/dashboard", 
            linkText: "Manage" 
        },
        { 
            title: "Trial Ends In", 
            value: getTrialDaysLeft(), 
            icon: CalendarDays, 
            change: "", 
            link: "/billing", 
            linkText: "View Plans" 
        }
    ];

    const quickActions = [
        { title: "Dashboard", icon: ArrowRight, href: "/dashboard", variant: "default" },
        { title: "Upgrade Plan", icon: ArrowRight, href: "/billing", variant: "outline" },
        { title: "Explore Features", icon: Lightbulb, href: "/#features", variant: "outline" },
        { title: "Update Profile", icon: UserCheck, href: "/settings", variant: "outline" }
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
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                });

                const statValueEl = card.querySelector("[data-animate='stat-value']");
                if (statValueEl && !statsLoading && !subLoading) {
                    const endValue = parseFloat(statValueEl.textContent || '0');
                    if (!isNaN(endValue) && endValue > 0) {
                         gsap.to(statValueEl, {
                            duration: 1.5,
                            innerText: endValue,
                            roundProps: "innerText",
                            ease: "power2.inOut",
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                            }
                        });
                    }
                }
            });

            gsap.from("[data-animate='quick-actions-title']", {
                scrollTrigger: { trigger: "[data-animate='quick-actions-title']", start: "top 90%" },
                duration: 0.8, y: 30, opacity: 0, ease: 'power3.out'
            });

            gsap.from("[data-animate='quick-action-button']", {
                scrollTrigger: { trigger: "[data-animate='quick-action-button']", start: "top 90%" },
                duration: 0.5, y: 30, opacity: 0, ease: 'power3.out', stagger: 0.15
            });

        }, containerRef);
        return () => ctx.revert();
    }, [statsLoading, subLoading]);

    return (
        <div ref={containerRef} className="flex-1 space-y-12 p-4 pt-6 md:p-8">
            <div className="space-y-2">
                <h2 data-animate="welcome-title" className="text-3xl md:text-4xl font-bold tracking-tight">
                    Welcome back, <span className="text-accent">{user?.displayName?.split(' ')[0] || 'User'}</span>!
                </h2>
                <p data-animate="welcome-desc" className="text-lg text-muted-foreground">Here's a quick overview of your account today.</p>
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} data-animate="stat-card" className="transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold capitalize" data-animate="stat-value">
                                {stat.value === -1 ? <Loader2 className="h-6 w-6 animate-spin" /> : (typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value)}
                            </div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-6">
                <h3 data-animate="quick-actions-title" className="text-2xl font-bold tracking-tight">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Button
                            key={action.title}
                            data-animate="quick-action-button"
                            variant={action.variant as any}
                            size="lg"
                            className="justify-start text-left"
                            asChild
                        >
                            <Link href={action.href}>
                                <action.icon className="mr-3 h-5 w-5" />
                                {action.title}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            <RecentActivity />

        </div>
    );
}
