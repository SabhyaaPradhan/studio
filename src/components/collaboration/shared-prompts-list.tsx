
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Edit3, Share2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const sharedPrompts = [
    { id: '1', name: 'Sales Follow-Up', category: 'Sales', permissions: 'Can Edit', collaborators: 3, sharedBy: 'alex@example.com', isPublic: false },
    { id: '2', name: 'Support Apology Template', category: 'Support', permissions: 'Can View', collaborators: 12, sharedBy: 'jane@example.com', isPublic: false },
    { id: '3', name: 'Marketing Campaign Kickoff', category: 'Marketing', permissions: 'Can Edit', collaborators: 5, sharedBy: 'you@example.com', isPublic: true },
];

export function SharedPromptsList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Shared Prompts</CardTitle>
                <CardDescription>Prompts that are shared with your team.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Prompt Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead>Shared By</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sharedPrompts.map(prompt => (
                            <TableRow key={prompt.id}>
                                <TableCell className="font-medium">{prompt.name}</TableCell>
                                <TableCell><Badge variant="secondary">{prompt.category}</Badge></TableCell>
                                <TableCell>{prompt.permissions}</TableCell>
                                <TableCell>{prompt.sharedBy}</TableCell>
                                <TableCell className="text-right">
                                    <TooltipProvider>
                                        <div className="flex justify-end gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild><Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button></TooltipTrigger>
                                                <TooltipContent><p>Copy Prompt</p></TooltipContent>
                                            </Tooltip>
                                             <Tooltip>
                                                <TooltipTrigger asChild><Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button></TooltipTrigger>
                                                <TooltipContent><p>Share</p></TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild><Button variant="ghost" size="icon"><Edit3 className="h-4 w-4" /></Button></TooltipTrigger>
                                                <TooltipContent><p>Edit</p></TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
