
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type RiskLevel = 'High' | 'Medium' | 'Low';

const riskStyles: Record<RiskLevel, { className: string, icon: LucideIcon }> = {
    'High': { className: 'border-red-500/50 bg-red-50 dark:bg-red-900/20', icon: AlertTriangle },
    'Medium': { className: 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20', icon: Clock },
    'Low': { className: 'border-green-500/50 bg-green-50 dark:bg-green-900/20', icon: ShieldCheck },
};


const mockFlags = [
    { id: '1', project: 'API Integration', risk: 'High' as RiskLevel, note: 'Backend tasks are 3 days behind schedule, impacting frontend.' },
    { id: '2', project: 'Mobile App Redesign', risk: 'Medium' as RiskLevel, note: 'Waiting on client feedback for the new wireframes for over a week.' },
    { id: '3', project: 'Marketing Website Launch', risk: 'Low' as RiskLevel, note: 'Content is finalized, pending final review from legal team.' },
];

export function DelayFlags() {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Project Delay Flags</CardTitle>
                <CardDescription>Potential risks identified by the AI assistant.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                {mockFlags.map(flag => {
                    const style = riskStyles[flag.risk];
                    const Icon = style.icon;
                    return (
                        <div key={flag.id} className={cn("p-4 border rounded-lg", style.className)}>
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-sm">{flag.project}</p>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Icon className="h-3 w-3" />
                                    {flag.risk} Risk
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{flag.note}</p>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}
