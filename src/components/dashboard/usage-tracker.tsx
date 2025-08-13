
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Crown } from "lucide-react";

interface UsageTrackerProps {
    onUpgradeClick: () => void;
}

export function UsageTracker({ onUpgradeClick }: UsageTrackerProps) {
    // This data would come from a hook like useUsage()
    const usage = {
        replies_used: 72,
        replies_limit: 100,
        plan: "Starter"
    };
    const percentage = (usage.replies_used / usage.replies_limit) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Usage This Month
                </CardTitle>
                <CardDescription>
                    You are on the <span className="font-semibold text-primary">{usage.plan}</span> plan.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">AI Replies</span>
                        <span className="text-muted-foreground">{usage.replies_used} / {usage.replies_limit}</span>
                    </div>
                    <Progress value={percentage} />
                </div>
                <Button variant="outline" className="w-full" onClick={onUpgradeClick}>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                </Button>
            </CardContent>
        </Card>
    );
}

    