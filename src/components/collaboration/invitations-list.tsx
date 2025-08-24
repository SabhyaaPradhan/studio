
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const invitations = [
    { id: '1', email: 'new.dev@example.com', role: 'Editor', status: 'Pending', sentDate: '2 days ago' },
    { id: '2', email: 'another.user@example.com', role: 'Viewer', status: 'Expired', sentDate: '8 days ago' },
];

export function InvitationsList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Invitations you have sent that have not yet been accepted.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invitations.map(invite => (
                             <TableRow key={invite.id}>
                                <TableCell className="font-medium">{invite.email}</TableCell>
                                <TableCell><Badge variant="outline">{invite.role}</Badge></TableCell>
                                <TableCell>
                                    <Badge variant={invite.status === 'Pending' ? 'default' : 'destructive'}>{invite.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="ghost" size="sm">Resend</Button>
                                        <Button variant="outline" size="sm">Cancel</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
