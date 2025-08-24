
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Target } from 'lucide-react';
import { FormsTab } from '@/components/lead-capture/forms-tab';
import { SubmissionsTab } from '@/components/lead-capture/submissions-tab';
import { AnalyticsTab } from '@/components/lead-capture/analytics-tab';
import { NewFormModal } from '@/components/lead-capture/new-form-modal';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradePlaceholder } from '@/components/collaboration/upgrade-placeholder';
import { Loader2 } from 'lucide-react';

export default function LeadCapturePage() {
    const { subscription, isLoading } = useSubscription();
    const [isNewFormModalOpen, setIsNewFormModalOpen] = useState(false);

    const canAccess = subscription?.plan === 'pro' || subscription?.plan === 'enterprise';

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (!canAccess) {
        return <UpgradePlaceholder />;
    }

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            <NewFormModal isOpen={isNewFormModalOpen} onOpenChange={setIsNewFormModalOpen} />
            
            <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Target className="h-7 w-7 text-primary" />
                        Lead Capture
                    </h1>
                    <p className="text-muted-foreground">Create forms, track submissions, and analyze performance.</p>
                </div>
                <Button onClick={() => setIsNewFormModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> New Form
                </Button>
            </header>

            <Tabs defaultValue="forms">
                <TabsList className="grid w-full grid-cols-1 md:w-auto md:grid-cols-3">
                    <TabsTrigger value="forms">Forms</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="forms" className="mt-6">
                    <FormsTab />
                </TabsContent>
                <TabsContent value="submissions" className="mt-6">
                    <SubmissionsTab />
                </TabsContent>
                <TabsContent value="analytics" className="mt-6">
                    <AnalyticsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
