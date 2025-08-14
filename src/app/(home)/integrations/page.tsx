
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function IntegrationsPage() {
    const { toast } = useToast();
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = () => {
        // In a real app, this would trigger the OAuth flow
        toast({
            title: "Connecting to Gmail...",
            description: "Please follow the instructions in the popup.",
        });
        setTimeout(() => {
            setIsConnected(true);
            toast({
                title: "Successfully connected!",
                description: "Your Gmail account is now integrated.",
            });
        }, 2000);
    }

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
                <p className="text-muted-foreground">Connect your tools and services to Savrii.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Email Integrations</CardTitle>
                    <CardDescription>Connect your email accounts to manage them directly from the Savrii Inbox.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                                <Mail className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="font-semibold">Gmail</p>
                                <p className="text-sm text-muted-foreground">Connect your Google account</p>
                            </div>
                        </div>
                        {isConnected ? (
                             <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-medium">Connected</span>
                            </div>
                        ) : (
                            <Button onClick={handleConnect}>Connect</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
