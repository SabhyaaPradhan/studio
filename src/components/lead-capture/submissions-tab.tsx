
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const mockSubmissions = [
    { id: '1', name: 'Alice Johnson', email: 'alice@corp.com', company: 'Innovate Inc.', status: 'approved', score: 92, formName: 'Website Contact Form', date: '2023-10-28' },
    { id: '2', name: 'Bob Williams', email: 'bob@startup.io', company: 'NextGen Solutions', status: 'pending', score: 78, formName: 'Demo Request Popup', date: '2023-10-27' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@design.co', company: 'Creative Co.', status: 'rejected', score: 45, formName: 'Newsletter Signup', date: '2023-10-26' },
    { id: '4', name: 'Diana Prince', email: 'diana@gov.org', company: 'Public Sector', status: 'approved', score: 88, formName: 'Website Contact Form', date: '2023-10-25' },
];

const statusColors: Record<string, string> = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};


export function SubmissionsTab() {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle>Submissions</CardTitle>
                        <CardDescription>A log of all leads captured through your forms.</CardDescription>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search submissions..." className="pl-8" />
                        </div>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by form" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Forms</SelectItem>
                                <SelectItem value="form1">Website Contact Form</SelectItem>
                                <SelectItem value="form2">Newsletter Signup</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Lead</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Form</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockSubmissions.map(sub => (
                            <TableRow key={sub.id}>
                                <TableCell>
                                    <div className="font-medium">{sub.name}</div>
                                    <div className="text-sm text-muted-foreground">{sub.email}</div>
                                </TableCell>
                                <TableCell>{sub.company}</TableCell>
                                <TableCell><Badge className={statusColors[sub.status]}>{sub.status}</Badge></TableCell>
                                <TableCell>{sub.score}</TableCell>
                                <TableCell>{sub.formName}</TableCell>
                                <TableCell>{sub.date}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">View</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
