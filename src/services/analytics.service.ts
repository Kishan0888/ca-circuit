import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Opportunity, AdminOverviewStats, TrendPoint } from '@/types';

type TimestampLike = Date | { toDate?: () => Date } | null | undefined;

function toDate(value: TimestampLike): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  return null;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function dayLabel(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export const analyticsService = {
  // Fetch every user + opportunity once, so the analytics page only needs one round trip each.
  async getRawData(): Promise<{ users: User[]; opportunities: Opportunity[] }> {
    const [usersSnap, oppsSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'opportunities')),
    ]);

    const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() } as User));
    const opportunities = oppsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Opportunity));

    return { users, opportunities };
  },

  computeOverviewStats(users: User[], opportunities: Opportunity[]): AdminOverviewStats {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const newUsersLast7Days = users.filter(u => {
      const created = toDate(u.createdAt);
      return created ? created.getTime() >= sevenDaysAgo : false;
    }).length;

    const byStatus = (status: Opportunity['status']) =>
      opportunities.filter(o => o.status === status).length;

    return {
      totalUsers: users.length,
      totalCAs: users.filter(u => u.role === 'ca').length,
      newUsersLast7Days,
      totalOpportunities: opportunities.length,
      pendingOpportunities: byStatus('pending'),
      publishedOpportunities: byStatus('published'),
      rejectedOpportunities: byStatus('rejected'),
      draftOpportunities: byStatus('draft'),
      archivedOpportunities: byStatus('archived'),
      totalViews: opportunities.reduce((sum, o) => sum + (o.viewCount || 0), 0),
      totalInterests: opportunities.reduce((sum, o) => sum + (o.interestedCount || 0), 0),
      totalBookmarks: opportunities.reduce((sum, o) => sum + (o.bookmarkCount || 0), 0),
    };
  },

  // Build a daily trend (last `days` days) counting how many items were created each day.
  buildDailyTrend<T>(items: T[], getCreatedAt: (item: T) => TimestampLike, days: number = 14): TrendPoint[] {
    const buckets = new Map<string, number>();
    const order: string[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      buckets.set(key, 0);
      order.push(key);
    }

    for (const item of items) {
      const created = toDate(getCreatedAt(item));
      if (!created) continue;
      const key = dayKey(created);
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) || 0) + 1);
      }
    }

    return order.map(key => ({
      label: dayLabel(new Date(key)),
      value: buckets.get(key) || 0,
    }));
  },

  // Group opportunities by category for a distribution chart.
  groupByCategory(opportunities: Opportunity[]): TrendPoint[] {
    const counts = new Map<string, number>();
    for (const opp of opportunities) {
      const key = opp.category || 'other';
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  },

  topViewedOpportunities(opportunities: Opportunity[], count: number = 5): Opportunity[] {
    return [...opportunities]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, count);
  },
};
