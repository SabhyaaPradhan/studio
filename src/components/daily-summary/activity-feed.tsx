
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Copy, Zap } from 'lucide-react';

const activities = [
    { id: '1', type: 'prompt', description: 'Copied prompt: Social Media Caption Generator.', time: '2h ago', icon: Copy },
    { id: '2', type: 'chat', description: 'New chat with AI assistant.', time: '3h ago', icon: Bot },
    { id: '3', type: 'integration', description: 'Zapier: Exported summary to Google Sheets.', time: '5h ago', icon: Zap },
    { id: '4', type: 'prompt', description: 'Copied prompt: Customer Support – Apology Template.', time: '8h ago', icon: Copy },
];

export function ActivityFeed() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>A chronological log of today's activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {activities.map(activity => {
                        const Icon = activity.icon;
                        return (
                            <li key={activity.id} className="flex items-start gap-4">
                                <div className="p-2 bg-secondary rounded-full mt-1">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm">{activity.description}</p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}

export function ActivityFeedSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-3 w-1/5" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
