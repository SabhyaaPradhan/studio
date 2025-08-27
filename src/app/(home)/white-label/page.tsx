
'use client';

import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/use-subscription';
import { Loader2, Lock, Paintbrush } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function WhiteLabelPage() {
    const { subscription, isLoading } = useSubscription();

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const canAccess = subscription?.plan === 'enterprise';

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8 relative h-full">
            <div className={cn(!canAccess && "blur-sm pointer-events-none")}>
                <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">White-label Customization</h1>
                        <p className="text-muted-foreground">This feature is currently under construction.</p>
                    </div>
                     <Button disabled={!canAccess}>Save & Apply Changes</Button>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Column 1: Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold">Branding</h3>
                                <p className="text-sm text-muted-foreground mt-1">Upload your company logo and favicon.</p>
                            </div>
                        </Card>
                         <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold">Theme Colors</h3>
                                <p className="text-sm text-muted-foreground mt-1">Customize the color palette.</p>
                            </div>
                        </Card>
                    </div>
                    {/* Column 2: Live Preview */}
                     <div className="lg:col-span-2">
                        <Card className="h-[600px]">
                           <div className="p-6">
                                <h3 className="text-lg font-semibold">Live Preview</h3>
                                <p className="text-sm text-muted-foreground mt-1">See your changes in real-time.</p>
                           </div>
                            <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground m-6 h-full flex items-center justify-center">
                                <Paintbrush className="h-12 w-12 mx-auto mb-4" />
                                <p>The live preview will be available here.</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {!canAccess && (
                 <div className="absolute inset-4 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm z-10">
                    <div className="text-center p-8">
                         <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
                            <Lock className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">White-labeling is an Enterprise feature</h2>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Fully customize the look and feel of your dashboard with your own branding, colors, and domain.
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
