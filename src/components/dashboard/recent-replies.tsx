
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listenToChatMessages, ChatMessage } from "@/services/firestore-service";
import { useAuthContext } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { MessageSquare, Bot } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const EmptyState = () => (
    <div className="text-center text-muted-foreground py-8">
        <p>No recent replies to display.</p>
        <p className="text-sm">Once you generate a response, it will appear here.</p>
    </div>
);

export function RecentReplies() {
    const { user } = useAuthContext();
    const [replies, setReplies] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user) {
            const unsubscribe = listenToChatMessages(user.uid, (messages) => {
                setReplies(messages.filter(m => m.role === 'model').slice(-5)); // Get last 5 AI messages
                setLoading(false);
            }, (err) => {
                console.error(err);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Recent AI Replies
                </CardTitle>
                <CardDescription>
                    A log of your most recent AI-generated responses.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : replies.length > 0 ? (
                    <ul className="space-y-4">
                        {replies.map((reply) => (
                             <li key={reply.id} className="flex items-start gap-4">
                                <div className="p-2 bg-secondary rounded-full">
                                    <Bot className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm line-clamp-2">{reply.content}</p>
                                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyState />
                )}
            </CardContent>
        </Card>
    );
}

    