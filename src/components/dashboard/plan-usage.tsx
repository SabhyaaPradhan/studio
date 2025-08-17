
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, Crown } from 'lucide-react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuthContext } from '@/context/auth-context';

export function PlanUsage() {
    const { user } = useAuthContext();
    const { isLoading, subscription } = useSubscription(user?.uid);

    if (isLoading) return <PlanUsageSkeleton />;
    
    const planName = subscription?.plan || 'Starter';
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Plan & Usage</CardTitle>
                <CardDescription>
                    You are currently on the <span className="font-semibold capitalize text-primary">{planName}</span> plan.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {subscription?.status === 'trialing' && subscription.trialDaysLeft != null && subscription.trialDaysLeft > 0 && (
                    <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-300 [&>svg]:text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Free Trial</AlertTitle>
                        <AlertDescription>
                            You have {subscription.trialDaysLeft} days left in your Pro trial.
                        </AlertDescription>
                    </Alert>
                )}
                 {subscription?.isTrialExpired && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Trial Expired</AlertTitle>
                        <AlertDescription>
                            Your free trial has ended. Please upgrade to continue.
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
                 <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );
}
