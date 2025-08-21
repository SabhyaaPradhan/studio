
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Edit, Copy, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const placeholderPrompts = [
    {
        id: '1',
        name: "Welcome Message",
        type: "system",
        variables: 2,
        tags: ["Onboarding", "General"],
        updatedAt: "2 hours ago",
        usageCount: 152,
        isFavorite: true,
    },
    {
        id: '2',
        name: "Refund Request Handler",
        type: "assistant",
        variables: 4,
        tags: ["Support", "Finance"],
        updatedAt: "1 day ago",
        usageCount: 89,
        isFavorite: false,
    },
    {
        id: '3',
        name: "Product How-To Guide",
        type: "user",
        variables: 1,
        tags: ["Support", "Product"],
        updatedAt: "3 days ago",
        usageCount: 340,
        isFavorite: false,
    }
];

interface PromptListProps {
    onEditPrompt: (promptId: string) => void;
}

export function PromptList({ onEditPrompt }: PromptListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderPrompts.map(prompt => (
                <Card key={prompt.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <CardTitle className="text-lg">{prompt.name}</CardTitle>
                             <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Star className={`h-4 w-4 ${prompt.isFavorite ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEditPrompt(prompt.id)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                        <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </div>
                        </div>
                        <CardDescription>
                            <Badge variant="outline" className="capitalize">{prompt.type}</Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            {prompt.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                        <p className="text-sm text-muted-foreground">Variables: {prompt.variables}</p>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground justify-between">
                        <span>Usage: {prompt.usageCount}</span>
                        <span>Updated: {prompt.updatedAt}</span>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
