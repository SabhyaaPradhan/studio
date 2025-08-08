
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
    const { user } = useAuthContext();
    
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.displayName || 'User'}!</h2>
            </div>
            
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>View Your Dashboard</CardTitle>
                    <CardDescription>
                        Check your statistics, manage your knowledge base, and more.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard">View Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>

             <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Explore More Features</CardTitle>
                    <CardDescription>
                        You are currently on the Pro plan. You have access to all features.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/billing">Manage Billing <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
