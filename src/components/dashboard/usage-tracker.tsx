
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Crown } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { listenToUser, UserProfile } from "@/services/user-service";
import { listenToAnalyticsDaily, DailyAnalytics } from "@/services/firestore-service";
import { Skeleton } from "../ui/skeleton";
import Link from 'next/link';

const getPlanLimit = (plan: UserProfile['subscription']['plan']) => {
    switch (plan) {
        case 'pro':
        case 'enterprise':
            return Infinity;
        case 'starter':
        default:
            return 100;
    }
}

export function UsageTracker() {
    const { user } = useAuthContext();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [monthlyReplies, setMonthlyReplies] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const unsubProfile = listenToUser(user.uid, (profile) => {
                setUserProfile(profile);
                if (loading) setLoading(false);
            });

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
                if (loading) setLoading(false);
            });

            return () => {
                unsubProfile();
                unsubAnalytics();
            }
        }
    }, [user, loading]);
    
    const planName = userProfile?.subscription?.plan || '...';
    const repliesLimit = userProfile?.subscription ? getPlanLimit(userProfile.subscription.plan) : 100;
    const isUnlimited = repliesLimit === Infinity;
    const percentage = isUnlimited ? 0 : (monthlyReplies / repliesLimit) * 100;
    const isStarterPlan = userProfile?.subscription?.plan === 'starter';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Usage This Month
                </CardTitle>
                {loading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                ) : (
                    <CardDescription>
                        You are on the <span className="font-semibold text-primary capitalize">{planName}</span> plan.
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="space-y-2">
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">AI Replies</span>
                            <span className="text-muted-foreground">
                                {monthlyReplies} / {isUnlimited ? '∞' : repliesLimit}
                            </span>
                        </div>
                        <Progress value={percentage} />
                    </div>
                )}
                {!loading && isStarterPlan && (
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/billing">
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade to Pro
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
