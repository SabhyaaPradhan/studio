
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';
import { BrainCircuit, CalendarDays, DollarSign, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    const { user } = useAuthContext();
    
    const stats = [
        { title: "AI Replies Today", value: "45", icon: MessageSquare, change: "+5 from yesterday" },
        { title: "Plan", value: "Free", icon: DollarSign, change: "Upgrade to Pro" },
        { title: "Knowledge Sources", value: "1", icon: BrainCircuit, change: "+0 this week" },
        { title: "Trial Ends In", value: "N/A", icon: CalendarDays, change: "" }
    ];

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.displayName || 'User'}!</h2>
                <p className="text-muted-foreground">Here's a quick overview of your account today.</p>
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="flex items-center gap-4">
                <Button asChild>
                    <Link href="/dashboard">View Full Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/billing">Upgrade Plan</Link>
                </Button>
            </div>
        </div>
    );
}
