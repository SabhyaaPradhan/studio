
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Users, FileText, Send } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradePlaceholder } from '@/components/collaboration/upgrade-placeholder';
import { MemberList } from '@/components/collaboration/member-list';
import { SharedPromptsList } from '@/components/collaboration/shared-prompts-list';
import { InvitationsList } from '@/components/collaboration/invitations-list';
import { Loader2 } from 'lucide-react';

export default function CollaborationPage() {
    const { subscription, isLoading } = useSubscription();

    const canCollaborate = subscription?.plan === 'pro' || subscription?.plan === 'enterprise';

    if (isLoading) {
        return (
             <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (!canCollaborate) {
        return <UpgradePlaceholder />;
    }

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Collaboration Tools</h1>
                    <p className="text-muted-foreground">Manage your team, share prompts, and collaborate seamlessly.</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                </Button>
            </header>
            
            <Tabs defaultValue="members">
                <TabsList className="grid w-full grid-cols-1 md:w-auto md:grid-cols-3">
                    <TabsTrigger value="members">
                        <Users className="mr-2 h-4 w-4" /> Team Members
                    </TabsTrigger>
                    <TabsTrigger value="prompts">
                        <FileText className="mr-2 h-4 w-4" /> Shared Prompts
                    </TabsTrigger>
                    <TabsTrigger value="invitations">
                        <Send className="mr-2 h-4 w-4" /> Pending Invitations
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="mt-6">
                    <MemberList />
                </TabsContent>
                <TabsContent value="prompts" className="mt-6">
                    <SharedPromptsList />
                </TabsContent>
                <TabsContent value="invitations" className="mt-6">
                    <InvitationsList />
                </TabsContent>
            </Tabs>
        </div>
    );
}
