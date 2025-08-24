
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Copy, Trash2, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Form } from './forms-tab';

interface FormCardProps {
    form: Form;
    onEmbed: (id: string) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: 'active' | 'paused') => void;
}

const statusColors: Record<Form['status'], string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export function FormCard({ form, onEmbed, onDelete, onStatusChange }: FormCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEmbed(form.id)}><Copy className="mr-2 h-4 w-4" /> Copy Embed Code</DropdownMenuItem>
                            <DropdownMenuItem><BarChart2 className="mr-2 h-4 w-4" /> View Analytics</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(form.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardDescription>Created: {form.createdDate}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="flex justify-between items-center">
                    <Badge variant="outline">{form.type}</Badge>
                    <Badge className={cn(statusColors[form.status])}>{form.status}</Badge>
                </div>
                <div className="flex justify-around text-center">
                    <div>
                        <p className="text-2xl font-bold">{form.submissions}</p>
                        <p className="text-xs text-muted-foreground">Submissions</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{form.conversionRate}</p>
                        <p className="text-xs text-muted-foreground">Conversion</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <span>Status</span>
                <Switch 
                    checked={form.status === 'active'}
                    onCheckedChange={(checked) => onStatusChange(form.id, checked ? 'active' : 'paused')}
                />
            </CardFooter>
        </Card>
    );
}
