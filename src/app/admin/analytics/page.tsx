'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Eye, Heart, Bookmark } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart } from '@/components/admin/charts/BarChart';
import { LineChart } from '@/components/admin/charts/LineChart';
import { analyticsService } from '@/services/analytics.service';
import { Opportunity, AdminOverviewStats, TrendPoint } from '@/types';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [oppTrend, setOppTrend] = useState<TrendPoint[]>([]);
  const [userTrend, setUserTrend] = useState<TrendPoint[]>([]);
  const [categoryDist, setCategoryDist] = useState<TrendPoint[]>([]);
  const [topOpps, setTopOpps] = useState<Opportunity[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { users, opportunities } = await analyticsService.getRawData();
    setStats(analyticsService.computeOverviewStats(users, opportunities));
    setOppTrend(analyticsService.buildDailyTrend(opportunities, (o) => o.createdAt, 14));
    setUserTrend(analyticsService.buildDailyTrend(users, (u) => u.createdAt, 14));
    setCategoryDist(analyticsService.groupByCategory(opportunities));
    setTopOpps(analyticsService.topViewedOpportunities(opportunities, 6));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <AdminHeader title="Analytics" description="Platform performance at a glance" />

      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Views" value={loading ? '—' : stats?.totalViews ?? 0} icon={Eye} />
          <StatCard title="Interests Expressed" value={loading ? '—' : stats?.totalInterests ?? 0} icon={Heart} />
          <StatCard title="Bookmarks" value={loading ? '—' : stats?.totalBookmarks ?? 0} icon={Bookmark} />
          <StatCard
            title="Approval Rate"
            value={
              loading || !stats || stats.totalOpportunities === 0
                ? '—'
                : `${Math.round((stats.publishedOpportunities / stats.totalOpportunities) * 100)}%`
            }
            icon={Eye}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>New Opportunities</CardTitle>
              <CardDescription>Last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={oppTrend} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Users</CardTitle>
              <CardDescription>Last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart data={userTrend} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Opportunities by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={categoryDist} barColor="var(--color-gold)" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Viewed Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              {topOpps.length === 0 ? (
                <p className="text-sm text-muted-foreground">No opportunities yet.</p>
              ) : (
                <div className="space-y-3">
                  {topOpps.map((opp) => (
                    <Link
                      key={opp.id}
                      href={`/admin/opportunities/${opp.id}/edit`}
                      className="flex items-center justify-between text-sm hover:underline"
                    >
                      <span className="truncate pr-4">{opp.title}</span>
                      <span className="text-muted-foreground shrink-0">{opp.viewCount || 0} views</span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
