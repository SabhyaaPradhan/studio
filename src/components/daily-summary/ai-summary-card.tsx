
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Share2, BellRing } from 'lucide-react';

export function AiSummaryCard() {
    const summaryText = "You used 12 prompts today (most popular: 'Customer Support – Apology Template'). Team engagement increased by 8% compared to yesterday. Two new leads were captured via the website integration.";
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>AI-Generated Summary</CardTitle>
                <CardDescription>A summary of today's key activities and insights.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm leading-relaxed">{summaryText}</p>
            </CardContent>
            <CardFooter className="gap-2">
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export as PDF</Button>
                <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share with Team</Button>
                <Button variant="outline"><BellRing className="mr-2 h-4 w-4" /> Schedule Daily Email</Button>
            </CardFooter>
        </Card>
    );
}

export function AiSummaryCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-36" />
            </CardFooter>
        </Card>
    );
}
