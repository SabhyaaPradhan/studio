
'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MeetingSummaries } from '@/components/ai-console/meeting-summaries';
import { NextWorkflowSteps } from '@/components/ai-console/next-workflow-steps';
import { DelayFlags } from '@/components/ai-console/delay-flags';
import { cn } from '@/lib/utils';

export default function AIConsolePage() {
    const { subscription, isLoading } = useSubscription();

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    const isEnterprise = subscription?.plan === 'enterprise';

    return (
        <div className="p-4 pt-6 md:p-8 space-y-6 relative h-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <h1 className="text-3xl font-bold tracking-tight">AI Assistant Console</h1>
                 <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse" />
                <p className="text-muted-foreground">Your command center for AI-driven insights and actions.</p>
            </motion.div>

            <div className={cn(!isEnterprise && "blur-sm pointer-events-none")}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <MeetingSummaries />
                    <NextWorkflowSteps />
                    <DelayFlags />
                </div>
            </div>

            {!isEnterprise && (
                <div className="absolute inset-4 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm z-10">
                    <div className="text-center p-8">
                         <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
                            <Lock className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">AI Console is an Enterprise feature</h2>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Get predictive insights, automated summaries, and proactive workflow suggestions by upgrading.
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
