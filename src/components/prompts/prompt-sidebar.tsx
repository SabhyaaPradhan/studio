
'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Hash,
  Star,
  PlusCircle,
  Archive,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import type { Group } from '@/services/firestore-service';
import { createGroup } from '@/services/firestore-service';
import { useAuthContext } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

interface PromptSidebarProps {
    groups: Group[];
    selectedGroupId: string | null;
    onSelectGroup: (group: Group) => void;
    isLoading: boolean;
}

const NewGroupModal = ({ onGroupCreated }: { onGroupCreated: () => void }) => {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = async () => {
        if (!user || !name) {
            toast({ variant: 'destructive', title: 'Error', description: 'Group name is required.' });
            return;
        }
        setIsSaving(true);
        try {
            await createGroup(user.uid, { name, description });
            toast({ title: 'Group created!', description: `The group #${name} has been successfully created.` });
            onGroupCreated();
            setIsOpen(false);
            setName('');
            setDescription('');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-muted-foreground justify-start gap-2 pl-2">
                    <PlusCircle className="h-4 w-4" /> Add Group
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new group</DialogTitle>
                    <DialogDescription>Groups are for organizing your team's conversations and workflows.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Group Name</Label>
                        <Input id="name" placeholder="e.g., marketing-campaign" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" placeholder="What is this group about?" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create Group
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export function PromptSidebar({ groups, selectedGroupId, onSelectGroup, isLoading }: PromptSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r p-4 bg-background">
        <nav className="flex flex-col gap-1">
            <Button variant="ghost" className="justify-start gap-2 text-md">
                <Hash className="h-5 w-5" /> All Groups
            </Button>
            <Button variant="ghost" className="justify-start gap-2 text-md">
                <Star className="h-5 w-5" /> Favorites
            </Button>
             <Button variant="ghost" className="justify-start gap-2 text-md">
                <Archive className="h-5 w-5" /> Archived
            </Button>
        </nav>
        
        <Separator className="my-4" />
        
        <div className="flex-1 space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2 flex items-center gap-2"><Hash className="h-4 w-4" /> Groups</h3>
                <div className="flex flex-col gap-1">
                    {isLoading ? (
                        <>
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </>
                    ) : (
                        groups.map(group => (
                            <Button 
                                key={group.id} 
                                variant={group.id === selectedGroupId ? 'secondary' : 'ghost'} 
                                className="justify-start gap-2"
                                onClick={() => onSelectGroup(group)}
                            >
                                #{group.name}
                            </Button>
                        ))
                    )}
                </div>
            </div>
             <div>
                 <NewGroupModal onGroupCreated={() => {}} />
            </div>
        </div>
    </aside>
  );
}
