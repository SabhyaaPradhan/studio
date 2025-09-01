
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';
import { useSubscription } from '@/hooks/use-subscription';
import { BrainCircuit, CalendarDays, DollarSign, MessageSquare, ArrowRight, Lightbulb, UserCheck, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RecentActivity } from '@/components/home/recent-activity';
import { listenToAnalyticsDaily, DailyAnalytics, listenToSamples, Sample } from '@/services/firestore-service';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
    const { user } = useAuthContext();
    const { subscription, isLoading: subLoading } = useSubscription();
    const containerRef = useRef<HTMLDivElement>(null);
    const [monthlyReplies, setMonthlyReplies] = useState(0);
    const [knowledgeSources, setKnowledgeSources] = useState(0);
    const [statsLoading, setStatsLoading] = useState(true);
    const [showTrialEndingModal, setShowTrialEndingModal] = useState(false);

    useEffect(() => {
        const isPaidPlan = subscription?.plan === 'pro' || subscription?.plan === 'enterprise';
        if (!subLoading && subscription?.status === 'trialing' && !isPaidPlan && subscription?.trialDaysLeft !== null && subscription.trialDaysLeft <= 3 && subscription.trialDaysLeft > 0) {
            const hasSeenModal = sessionStorage.getItem('hasSeenTrialEndingModal');
            if (!hasSeenModal) {
                setShowTrialEndingModal(true);
                sessionStorage.setItem('hasSeenTrialEndingModal', 'true');
            }
        }
    }, [subLoading, subscription]);
    
    useEffect(() => {
        if (user) {
            setStatsLoading(true);
            const today = new Date();
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

            const unsubAnalytics = listenToAnalyticsDaily(user.uid, daysInMonth, (analytics) => {
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                
                const currentMonthAnalytics = analytics.filter(day => {
                    const dayDate = new Date(day.date);
                    return dayDate.getMonth() === currentMonth && dayDate.getFullYear() === currentYear;
                });

                const totalReplies = currentMonthAnalytics.reduce((sum, day) => sum + (day.assistant_messages || 0), 0);
                setMonthlyReplies(totalReplies);
                setStatsLoading(false);
            }, (error) => {
                console.error("Failed to load realtime stats:", error);
                setStatsLoading(false);
            });
            
            const unsubSamples = listenToSamples(user.uid, (samples) => {
                setKnowledgeSources(samples.length);
            }, (error) => {
                 console.error("Failed to load knowledge sources:", error);
            });

            return () => {
                unsubAnalytics();
                unsubSamples();
            };
        }
    }, [user]);

    const getTrialDaysLeft = () => {
        if (subLoading) return "...";
        if (subscription?.status !== 'trialing' || !subscription.trialEnd) return "N/A";
        
        const now = new Date();
        const endDate = new Date(subscription.trialEnd);
        if(endDate < now) return "Expired";
        
        const diffTime = Math.abs(endDate.getTime() - now.getTime());
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
    }

    const allStats = [
        { 
            title: "Monthly Replies", 
            value: statsLoading ? -1 : monthlyReplies, 
            icon: MessageSquare, 
            change: "Total replies this month", 
            link: "/dashboard", 
            linkText: "View Details" 
        },
        { 
            title: "Plan", 
            value: subLoading ? "..." : (subscription?.plan ?? 'Starter'), 
            icon: DollarSign, 
            change: subscription?.plan === 'starter' ? "Upgrade to Pro" : "You're on the best plan!", 
            link: "/billing", 
            linkText: "Upgrade" 
        },
        { 
            title: "Knowledge Sources", 
            value: statsLoading ? -1 : knowledgeSources, 
            icon: BrainCircuit, 
            change: "Samples added for training", 
            link: "/brand-voice", 
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
    
    const stats = allStats.filter(stat => {
        if (stat.title === "Trial Ends In") {
            const isPaidPlan = subscription?.plan === 'pro' || subscription?.plan === 'enterprise';
            // Only show trial card if they are on a trial and NOT on a paid plan.
            return subscription?.status === 'trialing' && !isPaidPlan;
        }
        return true;
    });


    const quickActions = [
        { title: "Dashboard", icon: ArrowRight, href: "/dashboard", variant: "default" },
        { title: "Upgrade Plan", icon: ArrowRight, href: "/billing", variant: "outline" },
        { title: "Explore Features", icon: Lightbulb, href: "/features", variant: "outline" },
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
            <AlertDialog open={showTrialEndingModal} onOpenChange={setShowTrialEndingModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                            <AlertTriangle className="h-6 w-6 text-yellow-500" />
                        </div>
                        <AlertDialogTitle className="text-center">Your Trial is Ending Soon!</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            You have {subscription?.trialDaysLeft} day{subscription?.trialDaysLeft !== 1 ? 's' : ''} left on your Pro trial. Upgrade now to keep access to all Pro features.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center flex-row gap-2 pt-2">
                        <AlertDialogCancel>Dismiss</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Link href="/billing">Upgrade Now</Link>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        
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
