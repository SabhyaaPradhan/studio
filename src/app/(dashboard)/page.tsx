
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';
import { ArrowUpRight, DollarSign, BrainCircuit, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuthContext();
    const stats = [
        { title: "AI Replies Today", value: "1,204", icon: MessageSquare, change: "+12%" },
        { title: "Plan", value: "Pro", icon: DollarSign, change: "Monthly" },
        { title: "Knowledge Sources", value: "5", icon: BrainCircuit, change: "+1" },
        { title: "Trial Ends In", value: "12 days", icon: DollarSign, change: "" }
    ];
    
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.displayName || 'User'}!</h2>
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
                            <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Explore More Features</CardTitle>
                    <CardDescription>
                        You are currently on the Pro plan. You have access to all features.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/billing">Manage Billing</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

