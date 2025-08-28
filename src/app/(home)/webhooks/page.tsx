
'use client';

import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/use-subscription';
import { Loader2, Lock, Webhook } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function WebhooksPage() {
    const { subscription, isLoading } = useSubscription();

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const canAccess = subscription?.plan === 'enterprise';

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8 relative h-full">
            <div className={cn(!canAccess && "blur-sm pointer-events-none")}>
                <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
                        <p className="text-muted-foreground">This feature is currently under construction.</p>
                    </div>
                     <Button disabled={!canAccess}>Add Webhook</Button>
                </header>
                <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground mt-8">
                    <Webhook className="h-12 w-12 mx-auto mb-4" />
                    <p>Webhook configuration and delivery logs will be available here soon.</p>
                </div>
            </div>

            {!canAccess && (
                 <div className="absolute inset-4 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm z-10">
                    <div className="text-center p-8">
                         <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
                            <Lock className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Webhooks are an Enterprise feature</h2>
                        <p className="text-muted-foreground mb-6 max-w-md">
                           Integrate with external services and receive real-time event notifications by upgrading to Enterprise.
                        </p>
                        <Button asChild>
                            <Link href="/billing">Upgrade to Enterprise</Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
