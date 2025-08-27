
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const mockSummaries = [
    { id: '1', title: 'Q4 Strategy Session', date: 'Yesterday, 2:00 PM', summary: 'Key decisions were made on the new marketing budget and product roadmap. Follow-up required from the design team.' },
    { id: '2', title: 'Client Kick-off: Project Phoenix', date: 'Oct 20, 2023', summary: 'Client approved the initial mockups. Main concern is the timeline for the API integration.' },
    { id: '3', title: 'Weekly Stand-up', date: 'Oct 18, 2023', summary: 'Engineering team reported a blocker on the payment gateway. Marketing is ready to launch the new campaign.' },
];

export function MeetingSummaries() {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Meeting Summaries</CardTitle>
                <CardDescription>AI-generated key takeaways from recent meetings.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                {mockSummaries.map((item, index) => (
                    <div key={item.id}>
                        <div className="space-y-1">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                        </div>
                         {index < mockSummaries.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                 <Button variant="outline" size="sm" className="w-full">View All Summaries</Button>
            </CardFooter>
        </Card>
    );
}
