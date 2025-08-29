
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import type { Group } from "@/services/firestore-service";
import { formatDistanceToNow } from 'date-fns';

interface PromptListProps {
    groups: Group[];
    onSelectGroup: (group: Group) => void;
}

export function PromptList({ groups, onSelectGroup }: PromptListProps) {
    if (groups.length === 0) {
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
            {groups.map(group => (
                <Card key={group.id} className="flex flex-col cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1" onClick={() => onSelectGroup(group)}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <CardTitle className="text-lg">#{group.name}</CardTitle>
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
                        <span>{group.memberCount} members</span>
                         <span>Updated {formatDistanceToNow(group.updatedAt, { addSuffix: true })}</span>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
