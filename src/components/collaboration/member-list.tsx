
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Shield, Crown, Edit3, Trash2 } from 'lucide-react';

const members = [
    { id: '1', name: 'You', email: 'owner@example.com', role: 'Owner', status: 'Active', avatar: 'https://placehold.co/40x40.png', lastActive: 'Online' },
    { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Editor', status: 'Active', avatar: 'https://placehold.co/40x40.png', lastActive: '2 hours ago' },
    { id: '3', name: 'John Smith', email: 'john.smith@example.com', role: 'Viewer', status: 'Active', avatar: 'https://placehold.co/40x40.png', lastActive: '1 day ago' },
];

const roleColors: Record<string, string> = {
    Owner: 'border-amber-500 text-amber-500',
    Editor: 'border-blue-500 text-blue-500',
    Viewer: 'border-gray-500 text-gray-500',
};

const roleIcons: Record<string, React.ElementType> = {
    Owner: Crown,
    Editor: Edit3,
    Viewer: Shield,
}

export function MemberList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage who has access to this workspace.</CardDescription>
                <div className="flex items-center gap-4 pt-4">
                    <Input placeholder="Search members..." className="max-w-xs" />
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map(member => {
                            const RoleIcon = roleIcons[member.role] || Shield;
                            return (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={roleColors[member.role]}>
                                            <RoleIcon className="mr-1 h-3 w-3" /> {member.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{member.lastActive}</TableCell>
                                    <TableCell className="text-right">
                                        {member.role !== 'Owner' && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
