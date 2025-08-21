
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PromptSidebar } from '@/components/prompts/prompt-sidebar';
import { PromptList } from '@/components/prompts/prompt-list';
import { PromptEditor } from '@/components/prompts/prompt-editor';
import { Search, PlusCircle, Import, FileQuestion } from 'lucide-react';

export default function PromptsPage() {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    
    return (
        <div className="h-full w-full flex flex-col">
            {/* Top Bar */}
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-background">
                <h1 className="text-2xl font-bold tracking-tight">Custom Prompts</h1>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search prompts..." className="pl-10" />
                    </div>
                    <Button variant="outline" className="hidden sm:inline-flex">
                        <Import className="mr-2 h-4 w-4" /> Import
                    </Button>
                    <Button variant="outline" className="hidden sm:inline-flex">
                        <FileQuestion className="mr-2 h-4 w-4" /> Help
                    </Button>
                    <Button onClick={() => setIsEditorOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> New Prompt
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                <PromptSidebar />
                <main className="flex-1 p-6 overflow-y-auto">
                    <PromptList onEditPrompt={() => setIsEditorOpen(true)} />
                </main>
                <PromptEditor isOpen={isEditorOpen} onOpenChange={setIsEditorOpen} />
            </div>
        </div>
    );
}
