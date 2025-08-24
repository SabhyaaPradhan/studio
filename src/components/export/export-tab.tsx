
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from './date-range-picker';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

export function ExportTab() {
    const [isExporting, setIsExporting] = useState(false);
    const { toast } = useToast();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const handleExport = async () => {
        setIsExporting(true);
        toast({ title: 'Export started', description: 'Your data export is being processed. You can see the status in the History tab.' });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real app, you would handle success/error based on API response
        // For now, we just reset the state.
        setIsExporting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Export</CardTitle>
                <CardDescription>Select the data and format you want to export.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Data Type</Label>
                        <Select defaultValue="conversations">
                            <SelectTrigger>
                                <SelectValue placeholder="Select data type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="conversations">Conversations</SelectItem>
                                <SelectItem value="prompts" disabled>Prompts (coming soon)</SelectItem>
                                <SelectItem value="analytics" disabled>Analytics (coming soon)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Format</Label>
                         <Select defaultValue="csv">
                            <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="txt">TXT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                         <Label>Columns</Label>
                         <Select defaultValue="all">
                            <SelectTrigger>
                                <SelectValue placeholder="Select columns" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Columns</SelectItem>
                                <SelectItem value="custom" disabled>Custom (coming soon)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button onClick={handleExport} disabled={isExporting} className="w-full md:w-auto">
                    {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Start Export
                </Button>
            </CardContent>
        </Card>
    );
}
