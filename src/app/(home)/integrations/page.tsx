
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { listenToIntegrations, disconnectIntegration, Integration } from '@/services/firestore-service';
import { IntegrationCard, IntegrationCardSkeleton } from '@/components/integrations/integration-card';
import { Mail, MessageSquare, Slack } from 'lucide-react';
import { motion } from 'framer-motion';


const availableIntegrations = [
  { 
    id: "gmail", 
    name: "Gmail", 
    logo: Mail, 
    description: "Reply to emails automatically and track analytics.",
    comingSoon: false,
  },
  { 
    id: "outlook", 
    name: "Outlook", 
    logo: Mail, 
    description: "Connect your Microsoft account.",
    comingSoon: true,
  },
  { 
    id: "slack", 
    name: "Slack", 
    logo: Slack,
    description: "Respond to customer queries directly in Slack.",
    comingSoon: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    logo: MessageSquare,
    description: "Automate replies on the world's most popular messaging app.",
    comingSoon: true,
  }
];

export default function IntegrationsPage() {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const unsubscribe = listenToIntegrations(user.uid, (data) => {
                setIntegrations(data);
                setLoading(false);
            }, (error) => {
                console.error("Failed to load integrations:", error);
                toast({ variant: "destructive", title: "Error", description: "Could not load integrations." });
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user, toast]);
    
    useEffect(() => {
        // This effect runs when the user is redirected back from Google OAuth
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const success = urlParams.get('success');

        if (success) {
            toast({
                title: "Integration Connected!",
                description: "Successfully connected to Gmail. Your inbox will be synced shortly."
            });
            // Clean up the URL
            window.history.replaceState({}, document.title, "/integrations");
        }
        if (error) {
            toast({
                variant: "destructive",
                title: "Connection Failed",
                description: decodeURIComponent(error),
            });
             window.history.replaceState({}, document.title, "/integrations");
        }
    }, [toast]);

    const handleConnect = async (integrationId: string) => {
        if (!user) return;
        if (integrationId === 'gmail') {
            try {
                const res = await fetch(`/api/auth/google?userId=${user.uid}`);
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error('Could not get authentication URL.');
                }
            } catch (error: any) {
                toast({ variant: "destructive", title: "Connection Failed", description: error.message });
            }
        }
    };

    const handleDisconnect = async (integrationId: string) => {
        if (!user) return;
        try {
            await disconnectIntegration(user.uid, integrationId);
            toast({
                title: "Integration Disconnected",
                description: `Successfully disconnected from ${integrationId}.`
            });
        } catch (error) {
            console.error(`Failed to disconnect ${integrationId}:`, error);
            toast({ variant: "destructive", title: "Disconnection Failed", description: `Could not disconnect from ${integrationId}.` });
        }
    };
    
    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
            >
                <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
                <p className="text-muted-foreground">Connect Savrii with your favorite platforms for automated replies and insights.</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {loading ? (
                    <>
                        <IntegrationCardSkeleton />
                        <IntegrationCardSkeleton />
                        <IntegrationCardSkeleton />
                    </>
                ) : (
                    availableIntegrations.map((integrationInfo, index) => {
                        const connectedIntegration = integrations.find(i => i.id === integrationInfo.id);
                        return (
                             <motion.div
                                key={integrationInfo.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <IntegrationCard
                                    integration={integrationInfo}
                                    isConnected={!!connectedIntegration}
                                    connectionDetails={connectedIntegration?.details}
                                    onConnect={() => handleConnect(integrationInfo.id)}
                                    onDisconnect={() => handleDisconnect(integrationInfo.id)}
                                />
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
