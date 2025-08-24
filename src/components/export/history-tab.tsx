
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw, Trash2 } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type ExportStatus = 'processing' | 'completed' | 'failed';

const mockHistory = [
    { id: '1', fileName: 'conversations-2023-10-01.csv', status: 'completed' as ExportStatus, recordCount: 1254, fileSize: '1.2 MB', createdAt: '2 days ago', expiresAt: 'in 5 days' },
    { id: '2', fileName: 'all-convos-oct.json', status: 'processing' as ExportStatus, recordCount: 0, fileSize: 'N/A', createdAt: '5 minutes ago', expiresAt: 'in 7 days' },
    { id: '3', fileName: 'support-team-export.pdf', status: 'failed' as ExportStatus, recordCount: 0, fileSize: 'N/A', createdAt: '1 day ago', expiresAt: 'N/A' },
    { id: '4', fileName: 'analytics-q3.csv', status: 'completed' as ExportStatus, recordCount: 890, fileSize: '850 KB', createdAt: '1 week ago', expiresAt: 'Expired' },
];

const statusColors: Record<ExportStatus, string> = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 animate-pulse',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export function HistoryTab() {
    const [history, setHistory] = useState(mockHistory);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Export History</CardTitle>
                <CardDescription>A log of all your past and current data exports.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Records</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length > 0 ? history.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.fileName}</TableCell>
                                <TableCell><Badge className={cn(statusColors[item.status])}>{item.status}</Badge></TableCell>
                                <TableCell>{item.recordCount > 0 ? item.recordCount.toLocaleString() : '...'}</TableCell>
                                <TableCell>{item.fileSize}</TableCell>
                                <TableCell>{item.createdAt}</TableCell>
                                <TableCell>{item.expiresAt}</TableCell>
                                <TableCell className="text-right">
                                    <TooltipProvider>
                                        <div className="flex justify-end gap-1">
                                            {item.status === 'completed' && (
                                                 <Tooltip>
                                                    <TooltipTrigger asChild><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></TooltipTrigger>
                                                    <TooltipContent><p>Download</p></TooltipContent>
                                                </Tooltip>
                                            )}
                                            {item.status === 'failed' && (
                                                 <Tooltip>
                                                    <TooltipTrigger asChild><Button variant="ghost" size="icon"><RotateCcw className="h-4 w-4" /></Button></TooltipTrigger>
                                                    <TooltipContent><p>Retry Export</p></TooltipContent>
                                                </Tooltip>
                                            )}
                                             <Tooltip>
                                                <TooltipTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></TooltipTrigger>
                                                <TooltipContent><p>Delete</p></TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No export history yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
