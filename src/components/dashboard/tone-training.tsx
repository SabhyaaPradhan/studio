
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Lock, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ToneTraining() {
    const { subscription, isLoading } = useSubscription();

    const isProOrEnterprise = subscription?.plan === 'pro' || subscription?.plan === 'enterprise';

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-10 w-full mt-2" />
                </CardContent>
            </Card>
        );
    }

    return (
         <Card className={cn(!isProOrEnterprise && "bg-secondary/50")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Train Your Brand Voice
              </CardTitle>
              <CardDescription>
                Upload documents to teach the AI your unique tone and style.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Currently supports .txt, .md, and .pdf files. Your AI will learn from the content to provide more consistent, on-brand responses.
              </p>
              {isProOrEnterprise ? (
                <Button asChild variant="outline" className="w-full">
                    <Link href="/brand-voice">
                        <Upload className="w-4 h-4 mr-2" />
                        Manage Training Data
                    </Link>
                </Button>
              ) : (
                <Button asChild variant="default" className="w-full">
                    <Link href="/billing">
                        <Lock className="w-4 h-4 mr-2" />
                        Upgrade to Pro to Train
                    </Link>
                </Button>
              )}
            </CardContent>
          </Card>
    );
}
