
'use client';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/auth-context';
import Link from 'next/link';

export default function HomePage() {
    const { user } = useAuthContext();

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.displayName || 'User'}!</h2>
            </div>
            <div className="flex items-center gap-4">
                <Button asChild>
                    <Link href="/dashboard">View Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
