
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface NewFormModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewFormModal({ isOpen, onOpenChange }: NewFormModalProps) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1000));
        toast({ title: "Form created successfully!" });
        setIsSaving(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Form</DialogTitle>
                    <DialogDescription>Configure the details for your new lead capture form.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="form-name">Form Name</Label>
                        <Input id="form-name" placeholder="e.g., Website Contact Form" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="form-title">Form Title (Public)</Label>
                        <Input id="form-title" placeholder="e.g., Get In Touch" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="grid gap-2">
                            <Label htmlFor="form-type">Form Type</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inline">Inline</SelectItem>
                                    <SelectItem value="popup">Popup</SelectItem>
                                    <SelectItem value="widget">Widget</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="form-status">Status</Label>
                             <Select>
                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="thank-you-message">Thank You Message</Label>
                        <Textarea id="thank-you-message" placeholder="Thanks for reaching out! We'll be in touch soon." />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="email-notifications" />
                        <Label htmlFor="email-notifications">Send email notifications for new submissions</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Form
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
