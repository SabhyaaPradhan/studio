
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Edit, Copy, Trash2, MoreVertical, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const placeholderGroups = [
    {
        id: '1',
        name: "#general",
        description: "Announcements and team-wide chat.",
        lastMessage: "Meeting at 3 PM today.",
        updatedAt: "2 hours ago",
        members: 12,
        isFavorite: true,
    },
    {
        id: '2',
        name: "#support-requests",
        description: "Triage for incoming customer issues.",
        lastMessage: "New ticket from user@example.com",
        updatedAt: "5 minutes ago",
        members: 5,
        isFavorite: false,
    },
    {
        id: '3',
        name: "#marketing-campaign",
        description: "Planning for the Q4 launch.",
        lastMessage: "Draft of ad copy is ready for review.",
        updatedAt: "1 day ago",
        members: 8,
        isFavorite: false,
    }
];

interface PromptListProps {
    onEditPrompt: (promptId: string) => void;
}

export function PromptList({ onEditPrompt }: PromptListProps) {
    if (placeholderGroups.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-8 border rounded-lg h-full flex flex-col justify-center items-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Groups Yet</h3>
                <p className="mt-1">Create your first group to start collaborating.</p>
            </div>
        )
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderGroups.map(group => (
                <Card key={group.id} className="flex flex-col cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1" onClick={() => onEditPrompt(group.id)}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <CardTitle className="text-lg">{group.name}</CardTitle>
                             <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Star className={`h-4 w-4 ${group.isFavorite ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
                                </Button>
                             </div>
                        </div>
                        <CardDescription>
                            {group.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-sm text-muted-foreground italic">"{group.lastMessage}"</p>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground justify-between">
                        <span>{group.members} members</span>
                        <span>Updated: {group.updatedAt}</span>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
