
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
  FileText,
  Star,
  User,
  Share2,
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
                <FileText className="h-5 w-5" /> All Prompts
            </Button>
            <Button variant="ghost" className="justify-start gap-2 text-md">
                <Star className="h-5 w-5" /> Favorites
            </Button>
            <Button variant="ghost" className="justify-start gap-2 text-md">
                <User className="h-5 w-5" /> My Prompts
            </Button>
            <Button variant="ghost" className="justify-start gap-2 text-md">
                <Share2 className="h-5 w-5" /> Shared with Me
            </Button>
            <Button variant="ghost" className="justify-start gap-2 text-md">
                <Archive className="h-5 w-5" /> Archived
            </Button>
        </nav>
        
        <Separator className="my-4" />
        
        <div className="flex-1 space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2 flex items-center gap-2"><Folder className="h-4 w-4" /> Folders</h3>
                <div className="text-center text-xs text-muted-foreground py-4">No folders created yet.</div>
            </div>
             <div>
                <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2 flex items-center gap-2"><Tag className="h-4 w-4" /> Tags</h3>
                 <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Onboarding</Badge>
                    <Badge variant="secondary">Support</Badge>
                    <Badge variant="secondary">Finance</Badge>
                    <Badge variant="secondary">Product</Badge>
                 </div>
            </div>
        </div>
    </aside>
  );
}
