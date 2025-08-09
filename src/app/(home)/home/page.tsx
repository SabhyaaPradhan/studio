
'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';
import { BrainCircuit, CalendarDays, DollarSign, MessageSquare, ArrowRight, Lightbulb, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
    const { user } = useAuthContext();
    const containerRef = useRef<HTMLDivElement>(null);

    const stats = [
        { title: "AI Replies Today", value: 45, icon: MessageSquare, change: "+5 from yesterday", link: "/dashboard", linkText: "View Details" },
        { title: "Plan", value: "Free", icon: DollarSign, change: "Upgrade to Pro", link: "/billing", linkText: "Upgrade" },
        { title: "Knowledge Sources", value: 1, icon: BrainCircuit, change: "+0 this week", link: "/dashboard", linkText: "Manage" },
        { title: "Trial Ends In", value: "N/A", icon: CalendarDays, change: "", link: "/billing", linkText: "View Plans" }
    ];

    const quickActions = [
        { title: "View Full Dashboard", icon: ArrowRight, href: "/dashboard", variant: "default" },
        { title: "Upgrade Plan", icon: ArrowRight, href: "/billing", variant: "outline" },
        { title: "Explore Features", icon: Lightbulb, href: "/#features", variant: "outline" },
        { title: "Update Profile", icon: UserCheck, href: "/settings", variant: "outline" }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Welcome Message
            gsap.from("[data-animate='welcome-title']", { duration: 0.8, y: 30, opacity: 0, ease: 'power3.out', delay: 0.2 });
            gsap.from("[data-animate='welcome-desc']", { duration: 0.8, y: 30, opacity: 0, ease: 'power3.out', delay: 0.4 });

            // Animate Stat Cards and Counters
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
                if (statValueEl) {
                    const endValue = parseFloat(statValueEl.textContent || '0');
                    if (!isNaN(endValue)) {
                        gsap.to(statValueEl, {
                            duration: 2,
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

             // Animate Quick Actions
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
    }, []);

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
                            <div className="text-3xl font-bold" data-animate="stat-value">
                                {typeof stat.value === 'number' ? '0' : stat.value}
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

             <Card data-animate="stat-card">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of your most recent AI interactions and account events.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        <p>No recent activity to display.</p>
                        <p className="text-sm">Once you start using the AI, your history will appear here.</p>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
