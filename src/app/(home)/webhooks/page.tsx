
'use client';

import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/use-subscription';
import { Loader2, Lock, Webhook, PlusCircle, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { listenToWebhooks, Webhook as WebhookType } from '@/services/webhook-service';
import { useAuthContext } from '@/context/auth-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { NewWebhookModal } from '@/components/webhooks/new-webhook-modal';
import { useToast } from '@/hooks/use-toast';

export default function WebhooksPage() {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const { subscription, isLoading: isSubLoading } = useSubscription();
    const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            const unsubscribe = listenToWebhooks(
                user.uid,
                (data) => {
                    setWebhooks(data);
                    setIsLoading(false);
                },
                (error) => {
                    console.error(error);
                    toast({ variant: 'destructive', title: 'Error', description: 'Could not load webhooks.' });
                    setIsLoading(false);
                }
            );
            return () => unsubscribe();
        }
    }, [user, toast]);

    if (isSubLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const canAccess = subscription?.plan === 'enterprise';

    const statusColors: Record<string, string> = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        disabled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8 relative h-full">
            <NewWebhookModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
            <div className={cn(!canAccess && "blur-sm pointer-events-none")}>
                <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
                        <p className="text-muted-foreground">Manage API integrations and event subscriptions.</p>
                    </div>
                     <Button disabled={!canAccess} onClick={() => setIsModalOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Webhook
                    </Button>
                </header>
                
                <div className="border rounded-lg mt-8">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Endpoint URL</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Events</TableHead>
                                <TableHead>Last Delivered</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                            ) : webhooks.length === 0 ? (
                                 <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Webhook className="h-12 w-12" />
                                            <p className="font-medium">No webhooks yet.</p>
                                            <p className="text-sm">Add your first webhook to start receiving events.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                webhooks.map(hook => (
                                    <TableRow key={hook.id}>
                                        <TableCell className="font-mono text-xs truncate max-w-xs">{hook.endpointUrl}</TableCell>
                                        <TableCell><Badge className={statusColors[hook.status]}>{hook.status}</Badge></TableCell>
                                        <TableCell><Badge variant="outline">{hook.events.length} events</Badge></TableCell>
                                        <TableCell className="text-muted-foreground text-xs">
                                            {hook.lastDeliveredAt ? formatDistanceToNow(new Date(hook.lastDeliveredAt), { addSuffix: true }) : 'Never'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!canAccess && (
                 <div className="absolute inset-4 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm z-10">
                    <div className="text-center p-8">
                         <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
                            <Lock className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Webhooks are an Enterprise feature</h2>
                        <p className="text-muted-foreground mb-6 max-w-md">
                           Integrate with external services and receive real-time event notifications by upgrading to Enterprise.
                        </p>
                        <Button asChild>
                            <Link href="/billing">Upgrade to Enterprise</Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
