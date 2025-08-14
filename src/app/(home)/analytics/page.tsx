
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/auth-context';
import { listenToChatMessages, ChatMessage } from '@/services/firestore-service';
import { listenToUser, UserProfile } from '@/services/user-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, MessageSquare, TrendingUp, Target, Clock, AlertTriangle, ShieldCheck, BarChartHorizontal, Activity, Eye } from 'lucide-react';
import { MetricCard, MetricCardSkeleton } from '@/components/analytics/metric-card';
import { DailyUsageChart, DailyUsageChartSkeleton } from '@/components/analytics/daily-usage-chart';
import { PlanUsage, PlanUsageSkeleton } from '@/components/analytics/plan-usage';
import { GmailRepliesChart, GmailRepliesChartSkeleton } from '@/components/analytics/gmail-replies-chart';
import { subDays, startOfDay } from 'date-fns';
import { PeakActivityHeatmap } from '@/components/analytics/PeakActivityHeatmap';
import { EngagementRatesChart } from '@/components/analytics/EngagementRatesChart';


interface OverviewStats {
  totalResponses: number;
  thisWeekResponses: number;
  avgConfidence: number;
  avgResponseTime: number;
  highQualityCount: number;
  lowQualityCount: number;
  successRate: number;
}

interface DailySummary {
    [key: string]: {
        assistant_messages: number;
    }
}

export default function AnalyticsPage() {
  const { user } = useAuthContext();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubChat = listenToChatMessages(user.uid, (messages) => {
        setChatHistory(messages);
        calculateOverview(messages);
        if (loading) setLoading(false);
      }, (err) => {
        console.error(err);
        setLoading(false);
      });

      const unsubUser = listenToUser(user.uid, (profile) => {
        setUserProfile(profile);
      });
      
      return () => {
        unsubChat();
        unsubUser();
      };
    }
  }, [user, loading]);


  const calculateOverview = (messages: ChatMessage[]) => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const sevenDaysAgo = subDays(new Date(), 7);

    const recentMessages = messages.filter(msg => new Date(msg.createdAt) >= thirtyDaysAgo);
    const aiMessages = recentMessages.filter(msg => msg.role === 'model');

    const totalResponses = aiMessages.length;
    const thisWeekResponses = aiMessages.filter(msg => new Date(msg.createdAt) >= sevenDaysAgo).length;
    
    let totalConfidenceSum = 0;
    let totalLatencySum = 0;
    let highQualityCount = 0;
    let lowQualityCount = 0;

    aiMessages.forEach(msg => {
      if(msg.confidence !== undefined) {
          totalConfidenceSum += msg.confidence;
          if (msg.confidence >= 0.8) highQualityCount++;
          if (msg.confidence < 0.4) lowQualityCount++;
      }
      if(msg.latency_ms !== undefined) {
        totalLatencySum += msg.latency_ms;
      }
    });

    const avgConfidence = totalResponses > 0 ? (totalConfidenceSum / totalResponses) * 100 : 0;
    const avgResponseTime = totalResponses > 0 ? totalLatencySum / totalResponses : 0;
    const successRate = totalResponses > 0 ? ((totalResponses - lowQualityCount) / totalResponses) * 100 : 100;

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
  
    const getDailyUsageData = (messages: ChatMessage[]) => {
        const dailySummary: DailySummary = {};
        const thirtyDaysAgo = startOfDay(subDays(new Date(), 29));

        for (let i = 0; i < 30; i++) {
            const date = startOfDay(subDays(new Date(), i));
            const dateKey = date.toISOString().split('T')[0];
            dailySummary[dateKey] = { assistant_messages: 0 };
        }

        messages.forEach(msg => {
            if (msg.role === 'model') {
                const msgDate = startOfDay(new Date(msg.createdAt));
                if(msgDate >= thirtyDaysAgo) {
                    const dateKey = msgDate.toISOString().split('T')[0];
                    if (dailySummary[dateKey]) {
                        dailySummary[dateKey].assistant_messages += 1;
                    }
                }
            }
        });

        return Object.entries(dailySummary).map(([date, data]) => ({
            id: date,
            date,
            assistant_messages: data.assistant_messages,
        })).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const dailyDataForChart = getDailyUsageData(chatHistory);

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
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Daily Usage Trend</CardTitle>
            <CardDescription>AI responses generated over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? <DailyUsageChartSkeleton /> : <DailyUsageChart data={dailyDataForChart} />}
          </CardContent>
        </Card>
      </div>
      
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

        {/* Plan Usage Section */}
        <div className="lg:col-span-1">
          {loading || !userProfile ? <PlanUsageSkeleton /> : <PlanUsage userProfile={userProfile} />}
        </div>
      </div>
      
       {/* Activity and Engagement Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Peak Activity Periods
              </CardTitle>
              <CardDescription>Hourly AI reply volume over the last week.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
                <PeakActivityHeatmap userId={user?.uid} />
            </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Email Engagement Rates
              </CardTitle>
              <CardDescription>Open, reply, and bounce rates for emails.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
                <EngagementRatesChart userId={user?.uid} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
