
'use client';

import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/common/upgrade-modal';
import { useSubscription } from '@/hooks/use-subscription';
import { Loader2, Workflow } from 'lucide-react';
import { useState } from 'react';

export default function WorkflowBuilderPage() {
    const { subscription, isLoading } = useSubscription();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const canAccess = subscription?.plan === 'enterprise';

    if (!canAccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                {isUpgradeModalOpen && <UpgradeModal onOpenChange={setIsUpgradeModalOpen} />}
                <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
                    <Workflow className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Unlock the Workflow Builder</h1>
                <p className="text-muted-foreground mb-4 max-w-md">
                    Automate complex tasks and build custom logic with our drag-and-drop workflow builder, available on the Enterprise plan.
                </p>
                <Button onClick={() => setIsUpgradeModalOpen(true)}>Upgrade to Enterprise</Button>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Workflow Builder</h1>
                    <p className="text-muted-foreground">This feature is currently under construction.</p>
                </div>
            </header>
            <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
                <Workflow className="h-12 w-12 mx-auto mb-4" />
                <p>The drag-and-drop workflow builder will be available here soon.</p>
            </div>
        </div>
    );
}
