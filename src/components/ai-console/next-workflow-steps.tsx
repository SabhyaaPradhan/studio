
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Send, UserPlus } from 'lucide-react';

const mockSteps = [
    { id: '1', text: 'Draft Q4 report for Project Phoenix', icon: FileText, status: 'Suggested' },
    { id: '2', text: 'Send follow-up email to the new leads from yesterday', icon: Send, status: 'Suggested' },
    { id: '3', text: 'Onboard the new designer to the #design channel', icon: UserPlus, status: 'Suggested' },
];

export function NextWorkflowSteps() {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Next Step Suggestions</CardTitle>
                <CardDescription>AI-recommended actions based on recent activity.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 <ul className="space-y-4">
                    {mockSteps.map(step => {
                        const Icon = step.icon;
                        return (
                             <li key={step.id} className="flex items-center gap-4">
                                <div className="p-2 bg-secondary rounded-full">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <span className="flex-grow text-sm">{step.text}</span>
                                <Button variant="ghost" size="sm">Start</Button>
                            </li>
                        )
                    })}
                 </ul>
            </CardContent>
        </Card>
    );
}
