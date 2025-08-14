
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, listenToActivities } from '@/services/activity-service';
import { formatDistanceToNow } from 'date-fns';

const ActivityItem = ({ activity }: { activity: Activity }) => {
    const Icon = activity.icon;
    return (
        <li className="flex items-start gap-4">
            <div className="p-2 bg-secondary rounded-full mt-1">
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <p className="text-sm">{activity.text}</p>
                <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
            </div>
        </li>
    );
};

const ActivitySkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3 w-1/5" />
                </div>
            </div>
        ))}
    </div>
);

export function RecentActivity() {
    const { user } = useAuthContext();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const unsubscribe = listenToActivities(user.uid, (newActivities) => {
                setActivities(newActivities);
                setLoading(false);
            }, (error) => {
                console.error("Failed to load activities:", error);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of your most recent AI interactions and account events.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <ActivitySkeleton />
                ) : activities.length > 0 ? (
                    <ul className="space-y-4">
                        {activities.map((activity) => (
                            <ActivityItem key={activity.id} activity={activity} />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No recent activity to display.</p>
                        <p className="text-sm">Once you start using the AI, your history will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
