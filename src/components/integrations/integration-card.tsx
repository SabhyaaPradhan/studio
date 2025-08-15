
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { CheckCircle, Zap, XCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface IntegrationCardProps {
    integration: {
        id: string;
        name: string;
        logo: LucideIcon;
        description: string;
        comingSoon: boolean;
    };
    isConnected: boolean;
    connectionDetails?: { [key: string]: any };
    onConnect: (id: string) => void;
    onDisconnect: (id: string) => void;
}

export function IntegrationCard({ integration, isConnected, connectionDetails, onConnect, onDisconnect }: IntegrationCardProps) {
    const Logo = integration.logo;

    return (
        <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex-row items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                    <Logo className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle>{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                {isConnected && (
                     <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-md flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <p>
                            Connected as <span className="font-semibold">{connectionDetails?.email}</span>
                        </p>
                    </div>
                )}
                 {integration.comingSoon && !isConnected && (
                    <div className="text-sm text-muted-foreground">
                        <p>Coming soon!</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 {isConnected ? (
                    <Button variant="destructive" className="w-full" onClick={() => onDisconnect(integration.id)}>
                        <XCircle className="mr-2" />
                        Disconnect
                    </Button>
                ) : (
                    <Button 
                        className="w-full" 
                        onClick={() => onConnect(integration.id)} 
                        disabled={integration.comingSoon}
                    >
                        <Zap className="mr-2" />
                        {integration.comingSoon ? 'Coming Soon' : 'Connect'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export const IntegrationCardSkeleton = () => (
    <Card>
        <CardHeader className="flex-row items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
            </div>
        </CardHeader>
        <CardContent>
             <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
);
