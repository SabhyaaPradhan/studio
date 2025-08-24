
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, History } from 'lucide-react';
import { ExportTab } from '@/components/export/export-tab';
import { ImportTab } from '@/components/export/import-tab';
import { HistoryTab } from '@/components/export/history-tab';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradePlaceholder } from '@/components/collaboration/upgrade-placeholder';
import { Loader2 } from 'lucide-react';

export default function ExportDataPage() {
    const { subscription, isLoading } = useSubscription();
    
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
            <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Export & Import Data</h1>
                    <p className="text-muted-foreground">Manage your conversation history and other data.</p>
                </div>
            </header>

            <Tabs defaultValue="export">
                <TabsList className="grid w-full grid-cols-1 md:w-auto md:grid-cols-3">
                    <TabsTrigger value="export"><Download className="mr-2 h-4 w-4" /> Export</TabsTrigger>
                    <TabsTrigger value="import"><Upload className="mr-2 h-4 w-4" /> Import</TabsTrigger>
                    <TabsTrigger value="history"><History className="mr-2 h-4 w-4" /> History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="export" className="mt-6">
                    <ExportTab />
                </TabsContent>
                <TabsContent value="import" className="mt-6">
                    <ImportTab />
                </TabsContent>
                <TabsContent value="history" className="mt-6">
                    <HistoryTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
