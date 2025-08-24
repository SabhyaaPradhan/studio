
'use client';

import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/common/upgrade-modal';
import { Users } from 'lucide-react';
import { useState } from 'react';

export function UpgradePlaceholder() {
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            {isUpgradeModalOpen && <UpgradeModal onOpenChange={setIsUpgradeModalOpen} />}
            <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
                <Users className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Unlock Collaboration Tools</h1>
            <p className="text-muted-foreground mb-4 max-w-md">
                Invite your team, share prompts, and work together by upgrading to a Pro plan.
            </p>
            <Button onClick={() => setIsUpgradeModalOpen(true)}>Upgrade to Pro</Button>
        </div>
    );
}
