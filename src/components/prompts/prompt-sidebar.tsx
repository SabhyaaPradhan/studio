
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import {
  Hash,
  Star,
  PlusCircle,
  Archive,
  Folder,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export function PromptSidebar() {
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
                    <Button variant="secondary" className="justify-start gap-2">#general</Button>
                    <Button variant="ghost" className="justify-start gap-2">#support-requests</Button>
                    <Button variant="ghost" className="justify-start gap-2">#marketing-campaign</Button>
                </div>
            </div>
             <div>
                 <Button variant="link" className="text-muted-foreground justify-start gap-2 pl-2">
                    <PlusCircle className="h-4 w-4" /> Add Group
                 </Button>
            </div>
        </div>
    </aside>
  );
}
