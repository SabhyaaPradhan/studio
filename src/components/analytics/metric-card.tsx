
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  progress?: number;
  variant?: 'default' | 'inner';
}

export function MetricCard({ title, value, icon: Icon, description, progress, variant = 'default' }: MetricCardProps) {
  const CardComponent = variant === 'inner' ? 'div' : Card;

  return (
    <CardComponent className={cn(variant === 'inner' && 'rounded-lg border p-4')}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 p-0 md:p-6 md:pt-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {progress !== undefined && (
          <Progress value={progress} className="mt-2 h-2" />
        )}
      </CardContent>
    </CardComponent>
  );
}

export function MetricCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-7 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </CardContent>
        </Card>
    )
}
