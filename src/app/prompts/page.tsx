
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { PromptSidebar } from '@/components/prompts/prompt-sidebar';
import { PromptList } from '@/components/prompts/prompt-list';
import { PromptEditor } from '@/components/prompts/prompt-editor';
import { Search, PlusCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { listenToGroups, createGroup, Group } from '@/services/firestore-service';

export default function PromptsPage() {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    
    useEffect(() => {
        if (user) {
            setIsLoading(true);
            const unsubscribe = listenToGroups(user.uid, 
                (newGroups) => {
                    setGroups(newGroups);
                    setIsLoading(false);
                    // If no group is selected, or selected group is deleted, select the first one
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
        }
    }, [user, toast]);

    const handleSelectGroup = (group: Group) => {
        setSelectedGroup(group);
        setIsEditorOpen(true);
    };

    return (
        <div className="h-full w-full flex flex-col">
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
