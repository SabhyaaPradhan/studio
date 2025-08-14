
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import type { UserProfile } from '@/services/user-service';
import { differenceInDays, isPast } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, Crown } from 'lucide-react';
import Link from 'next/link';

interface PlanUsageProps {
  userProfile: UserProfile | null;
}

export function PlanUsage({ userProfile }: PlanUsageProps) {
    if (!userProfile) return <PlanUsageSkeleton />;
    
    const trialEndDate = new Date(userProfile.trial_end_date);
    const trialDaysLeft = differenceInDays(trialEndDate, new Date());
    const isTrialActive = trialDaysLeft > 0 && !isPast(trialEndDate);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Plan & Usage</CardTitle>
                <CardDescription>
                    You are currently on the <span className="font-semibold capitalize text-primary">{userProfile.plan}</span> plan.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isTrialActive && (
                    <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-300 [&>svg]:text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Trial Period</AlertTitle>
                        <AlertDescription>
                            You have {trialDaysLeft} days left in your Pro trial.
                        </AlertDescription>
                    </Alert>
                )}
                <Button asChild className="w-full">
                    <Link href="/billing">
                        <Crown className="mr-2 h-4 w-4" />
                        Manage Subscription
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}


export function PlanUsageSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );
}
