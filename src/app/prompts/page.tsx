
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { PromptSidebar } from '@/components/prompts/prompt-sidebar';
import { PromptList } from '@/components/prompts/prompt-list';
import { PromptEditor } from '@/components/prompts/prompt-editor';
import { Search, PlusCircle, Loader2, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { listenToGroups, createGroup, Group } from '@/services/firestore-service';
import { useSubscription } from '@/hooks/use-subscription';
import Link from 'next/link';
import { UpgradeModal } from '@/components/common/upgrade-modal';

export default function PromptsPage() {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    
    const { subscription, isLoading: isSubLoading } = useSubscription();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const canAccess = subscription?.plan === 'pro' || subscription?.plan === 'enterprise';

    useEffect(() => {
        if (user && canAccess) {
            setIsLoading(true);
            const unsubscribe = listenToGroups(user.uid, 
                (newGroups) => {
                    setGroups(newGroups);
                    setIsLoading(false);
                    if (!selectedGroup || !newGroups.some(g => g.id === selectedGroup.id)) {
                        setSelectedGroup(newGroups[0] || null);
                    }
                }, 
                (error) => {
                    console.error("Failed to load groups:", error);
                    toast({ variant: 'destructive', title: 'Error', description: 'Could not load groups.' });
                    setIsLoading(false);
                }
            );
            return () => unsubscribe();
        } else if (!isSubLoading) {
            setIsLoading(false);
        }
    }, [user, toast, canAccess, isSubLoading, selectedGroup]);

    const handleSelectGroup = (group: Group) => {
        setSelectedGroup(group);
        setIsEditorOpen(true);
    };

    if (isLoading || isSubLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (!canAccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 {isUpgradeModalOpen && <UpgradeModal onOpenChange={setIsUpgradeModalOpen} />}
                 <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
                    <Lock className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Custom Prompts is a Pro feature</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                   Upgrade your plan to create, manage, and share custom prompts with your team.
                </p>
                <Button onClick={() => setIsUpgradeModalOpen(true)}>Upgrade to Pro</Button>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            {isUpgradeModalOpen && <UpgradeModal onOpenChange={setIsUpgradeModalOpen} />}
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-background">
                <h1 className="text-2xl font-bold tracking-tight">Groups & Prompts</h1>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search groups..." className="pl-10" />
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <PromptSidebar 
                    groups={groups} 
                    selectedGroupId={selectedGroup?.id} 
                    onSelectGroup={setSelectedGroup} 
                    isLoading={isLoading}
                />
                <main className="flex-1 p-6 overflow-y-auto">
                     {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <PromptList groups={groups} onSelectGroup={handleSelectGroup} />
                    )}
                </main>
                <PromptEditor 
                    isOpen={isEditorOpen} 
                    onOpenChange={setIsEditorOpen}
                    group={selectedGroup}
                />
            </div>
        </div>
    );
}
