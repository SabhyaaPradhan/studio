
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { KpiCard, KpiCardSkeleton } from '@/components/daily-summary/kpi-card';
import { AiSummaryCard, AiSummaryCardSkeleton } from '@/components/daily-summary/ai-summary-card';
import { ActivityFeed, ActivityFeedSkeleton } from '@/components/daily-summary/activity-feed';
import { ChartsCard, ChartsCardSkeleton } from '@/components/daily-summary/charts-card';
import { useAuthContext } from '@/context/auth-context';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradeModal } from '@/components/common/upgrade-modal';
import { Loader2 } from 'lucide-react';

export default function DailySummaryPage() {
    const { user } = useAuthContext();
    const { subscription, isLoading: isSubLoading } = useSubscription();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isLoading, setIsLoading] = useState(false); // For data fetching
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    
    const isPro = subscription?.plan === 'pro' || subscription?.plan === 'enterprise';

    if (isSubLoading) {
         return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (!isPro) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 {isUpgradeModalOpen && <UpgradeModal onOpenChange={setIsUpgradeModalOpen} />}
                <h1 className="text-2xl font-bold mb-2">Unlock Daily Summaries</h1>
                <p className="text-muted-foreground mb-4 max-w-md">Access daily insights and performance analytics by upgrading to a Pro plan.</p>
                <Button onClick={() => setIsUpgradeModalOpen(true)}>Upgrade to Pro</Button>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            {isUpgradeModalOpen && <UpgradeModal onOpenChange={setIsUpgradeModalOpen} />}
            <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-7 w-7 text-primary" />
                        Daily Summary
                    </h1>
                    <p className="text-muted-foreground">A quick overview of your activity, performance, and insights.</p>
                </div>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </header>

            <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <section className="lg:col-span-3 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                    {isLoading ? <KpiCardSkeleton /> : <KpiCard title="Messages Sent" value="152" trend="+5%" />}
                    {isLoading ? <KpiCardSkeleton /> : <KpiCard title="Prompts Used" value="28" trend="-2%" />}
                    {isLoading ? <KpiCardSkeleton /> : <KpiCard title="Team Members Active" value="3" trend="+1" />}
                    {isLoading ? <KpiCardSkeleton /> : <KpiCard title="Reports Exported" value="1" trend="0%" />}
                </section>
                
                <section className="lg:col-span-2 space-y-6">
                    {isLoading ? <AiSummaryCardSkeleton /> : <AiSummaryCard />}
                    {isLoading ? <ChartsCardSkeleton /> : <ChartsCard />}
                </section>
                
                <aside className="lg:col-span-1">
                     {isLoading ? <ActivityFeedSkeleton /> : <ActivityFeed />}
                </aside>
            </main>
        </div>
    );
}
