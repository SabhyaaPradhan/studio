
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatCard } from './stat-card';
import { Check, Clock, User } from 'lucide-react';

const submissionStatusData = [
  { name: 'Approved', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Pending', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Rejected', value: 200, fill: 'hsl(var(--destructive))' },
];

const submissionsBySourceData = [
  { name: 'Direct', count: 120 },
  { name: 'Referral', count: 90 },
  { name: 'Organic', count: 75 },
  { name: 'Paid', count: 50 },
];

const formPerformanceData = [
    { name: 'Website Contact Form', submissions: 120, conversionRate: '15.2%', status: 'Active' },
    { name: 'Newsletter Signup', submissions: 98, conversionRate: '22.5%', status: 'Active' },
    { name: 'Demo Request Popup', submissions: 45, conversionRate: '8.1%', status: 'Paused' },
];

const recentActivityData = [
    { name: 'Alice Johnson', email: 'alice@example.com', time: '2m ago' },
    { name: 'Bob Williams', email: 'bob@example.com', time: '15m ago' },
    { name: 'Charlie Brown', email: 'charlie@example.com', time: '1h ago' },
];

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Submissions" value="980" icon={User} />
            <StatCard title="Conversion Rate" value="18.2%" icon={Check} />
            <StatCard title="Avg. Score" value="78" icon={Clock} />
            <StatCard title="Top Form" value="Website Contact" icon={Check} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Submissions by Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={submissionStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {submissionStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Submissions by Source</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={submissionsBySourceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

         <Card>
            <CardHeader>
                <CardTitle>Form Performance</CardTitle>
                <CardDescription>An overview of how each form is performing.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Form Name</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead>Conversion Rate</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formPerformanceData.map(form => (
                            <TableRow key={form.name}>
                                <TableCell>{form.name}</TableCell>
                                <TableCell>{form.submissions}</TableCell>
                                <TableCell>{form.conversionRate}</TableCell>
                                <TableCell>{form.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {recentActivityData.map(activity => (
                        <li key={activity.email} className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{activity.name}</p>
                                <p className="text-sm text-muted-foreground">{activity.email}</p>
                            </div>
                            <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
