
'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Copy } from 'lucide-react';
import { createWebhook } from '@/services/webhook-service';
import { useAuthContext } from '@/context/auth-context';

interface NewWebhookModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const allEvents = [
    { id: 'conversation.created', label: 'Conversation Created' },
    { id: 'message.sent', label: 'Message Sent' },
    { id: 'message.received', label: 'Message Received' },
    { id: 'reply.generated', label: 'AI Reply Generated' },
];

export function NewWebhookModal({ isOpen, onOpenChange }: NewWebhookModalProps) {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [endpointUrl, setEndpointUrl] = useState('');
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [secret, setSecret] = useState('whsec_...');

    const handleEventChange = (eventId: string, checked: boolean) => {
        setSelectedEvents(prev =>
            checked ? [...prev, eventId] : prev.filter(id => id !== eventId)
        );
    };
    
    const handleSave = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        if (!endpointUrl.startsWith('https://')) {
            toast({ variant: 'destructive', title: 'Invalid URL', description: 'Endpoint URL must start with https://' });
            return;
        }
        if (selectedEvents.length === 0) {
            toast({ variant: 'destructive', title: 'No Events Selected', description: 'Please select at least one event to subscribe to.' });
            return;
        }

        setIsSaving(true);
        try {
            const newWebhook = await createWebhook(user.uid, {
                endpointUrl,
                events: selectedEvents,
            });
            setSecret(newWebhook.secretKey);
            toast({ title: "Webhook created successfully!" });
            // Keep modal open to show secret, let user close it.
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Failed to create webhook', description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCopySecret = () => {
        navigator.clipboard.writeText(secret);
        toast({ title: 'Signing secret copied!' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Webhook Endpoint</DialogTitle>
                    <DialogDescription>
                        Configure a new endpoint to receive events from your account.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="endpoint-url">Endpoint URL</Label>
                        <Input
                            id="endpoint-url"
                            placeholder="https://your-server.com/api/webhooks"
                            value={endpointUrl}
                            onChange={(e) => setEndpointUrl(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Events to send</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2 p-4 border rounded-md">
                            {allEvents.map((event) => (
                                <div key={event.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={event.id}
                                        checked={selectedEvents.includes(event.id)}
                                        onCheckedChange={(checked) => handleEventChange(event.id, !!checked)}
                                    />
                                    <Label htmlFor={event.id} className="font-normal">{event.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="signing-secret">Signing Secret</Label>
                        <div className="flex items-center gap-2">
                            <Input id="signing-secret" value={secret} readOnly className="font-mono text-xs" />
                            <Button variant="outline" size="icon" onClick={handleCopySecret}><Copy className="h-4 w-4" /></Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Keep this secret safe. You'll use it to verify incoming webhook requests.</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Webhook
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
