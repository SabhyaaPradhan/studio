
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/auth-context';
import { listenToAnalyticsDaily, DailyAnalytics, listenToUser, UserProfile } from '@/services/firestore-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, MessageSquare, TrendingUp, Target, Clock, AlertTriangle, ShieldCheck, BarChartHorizontal } from 'lucide-react';
import { MetricCard, MetricCardSkeleton } from '@/components/analytics/metric-card';
import { DailyUsageChart, DailyUsageChartSkeleton } from '@/components/analytics/daily-usage-chart';
import { TemplatesPieChart } from '@/components/analytics/templates-pie-chart';
import { ActivityHeatmap, ActivityHeatmapSkeleton } from '@/components/analytics/activity-heatmap';
import { PlanUsage, PlanUsageSkeleton } from '@/components/analytics/plan-usage';

interface OverviewStats {
  totalResponses: number;
  thisWeekResponses: number;
  avgConfidence: number;
  avgResponseTime: number;
  highQualityCount: number;
  lowQualityCount: number;
  successRate: number;
}

export default function AnalyticsPage() {
  const { user } = useAuthContext();
  const [dailyData, setDailyData] = useState<DailyAnalytics[]>([]);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubDaily = listenToAnalyticsDaily(user.uid, 30, (data) => {
        setDailyData(data);
        calculateOverview(data);
        if (loading) setLoading(false);
      }, (err) => {
        console.error(err);
        setLoading(false);
      });

      const unsubUser = listenToUser(user.uid, (profile) => {
        setUserProfile(profile);
      });
      
      return () => {
        unsubDaily();
        unsubUser();
      };
    }
  }, [user]);

  const calculateOverview = (data: DailyAnalytics[]) => {
    const totalResponses = data.reduce((sum, day) => sum + (day.assistant_messages || 0), 0);
    const thisWeekResponses = data.slice(0, 7).reduce((sum, day) => sum + (day.assistant_messages || 0), 0);
    
    let totalConfidenceSum = 0;
    let confidenceCount = 0;
    let totalLatencySum = 0;
    let latencyCount = 0;
    let highQualityCount = 0;
    let lowQualityCount = 0;

    data.forEach(day => {
      if (day.confidence_buckets) {
        Object.entries(day.confidence_buckets).forEach(([bucket, count]) => {
          const [min] = bucket.split('-').map(Number);
          if (min >= 0.8) highQualityCount += count;
          if (min < 0.4) lowQualityCount += count; // Assuming < 40% is "low quality"
          const midPoint = (parseFloat(bucket.split('-')[0]) + parseFloat(bucket.split('-')[1])) / 2;
          totalConfidenceSum += midPoint * count;
          confidenceCount += count;
        });
      }
      if(day.sum_latency_ms && day.assistant_messages) {
        totalLatencySum += day.sum_latency_ms;
        latencyCount += day.assistant_messages;
      }
    });

    const avgConfidence = confidenceCount > 0 ? (totalConfidenceSum / confidenceCount) * 100 : 0;
    const avgResponseTime = latencyCount > 0 ? totalLatencySum / latencyCount : 0;
    const successRate = totalResponses > 0 ? ( (totalResponses - lowQualityCount) / totalResponses) * 100 : 100;

    setOverview({
      totalResponses,
      thisWeekResponses,
      avgConfidence,
      avgResponseTime,
      highQualityCount,
      lowQualityCount,
      successRate
    });
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your AI assistant usage and performance.</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary/50">
          <BarChart3 className="mr-2 h-4 w-4" />
          Real-time Data
        </Badge>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !overview ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard 
              title="Total Responses" 
              value={overview.totalResponses.toLocaleString()} 
              icon={MessageSquare} 
              description="Last 30 days" />
            <MetricCard 
              title="This Week" 
              value={overview.thisWeekResponses.toLocaleString()} 
              icon={TrendingUp} 
              description="Last 7 days" />
            <MetricCard
              title="Avg. Confidence"
              value={`${overview.avgConfidence.toFixed(1)}%`}
              icon={Target}
              description="Overall response accuracy"
              progress={overview.avgConfidence}
            />
            <MetricCard 
              title="Avg. Response Time" 
              value={`${(overview.avgResponseTime / 1000).toFixed(2)}s`} 
              icon={Clock} 
              description="Average generation speed" />
          </>
        )}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Daily Usage Trend</CardTitle>
            <CardDescription>AI responses generated over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? <DailyUsageChartSkeleton /> : <DailyUsageChart data={dailyData} />}
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Popular Templates</CardTitle>
            <CardDescription>Most frequently used reply templates.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
             {loading ? <DailyUsageChartSkeleton /> : <TemplatesPieChart />}
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity</CardTitle>
          <CardDescription>Shows the busiest hours for AI interactions during the day.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
           {loading ? <ActivityHeatmapSkeleton /> : <ActivityHeatmap />}
        </CardContent>
      </Card>
      
      {/* Performance & Plan Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key metrics for evaluating response quality.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {loading || !overview ? (
                  <>
                    <MetricCardSkeleton />
                    <MetricCardSkeleton />
                    <MetricCardSkeleton />
                  </>
                ) : (
                <>
                  <MetricCard
                    variant="inner"
                    title="High Quality"
                    value={overview.highQualityCount.toLocaleString()}
                    icon={ShieldCheck}
                    description=">80% confidence"
                  />
                  <MetricCard
                    variant="inner"
                    title="Success Rate"
                    value={`${overview.successRate.toFixed(1)}%`}
                    icon={BarChartHorizontal}
                    description="Successful responses"
                  />
                  <MetricCard
                    variant="inner"
                    title="Needs Improvement"
                    value={overview.lowQualityCount.toLocaleString()}
                    icon={AlertTriangle}
                    description="<40% confidence"
                  />
                </>
                )}
            </CardContent>
        </Card>

        {loading || !userProfile ? <PlanUsageSkeleton /> : <PlanUsage userProfile={userProfile} />}
      </div>
    </div>
  );
}
