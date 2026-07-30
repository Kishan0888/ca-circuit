'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Heart,
  ArrowRight,
  History,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { opportunityService } from '@/services/opportunity.service';
import { adminService } from '@/services/admin.service';
import { analyticsService } from '@/services/analytics.service';
import { Opportunity, AdminOverviewStats, AuditLog } from '@/types';

const AUDIT_LABELS: Record<string, string> = {
  opportunity_approved: 'approved',
  opportunity_rejected: 'rejected',
  opportunity_created: 'created',
  opportunity_updated: 'updated',
  opportunity_deleted: 'deleted',
  opportunity_featured: 'featured',
  opportunity_unfeatured: 'unfeatured',
  user_role_changed: "changed a user's role for",
  user_suspended: 'suspended',
  user_reactivated: 'reactivated',
};

export default function AdminDashboardPage() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [pending, setPending] = useState<Opportunity[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [actionTarget, setActionTarget] = useState<{ opp: Opportunity; type: 'approve' | 'reject' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ users, opportunities }, pendingOpps, recentLogs] = await Promise.all([
      analyticsService.getRawData(),
      opportunityService.getOpportunitiesByStatus('pending'),
      adminService.getRecentAuditLogs(8),
    ]);
    setStats(analyticsService.computeOverviewStats(users, opportunities));
    setPending(pendingOpps.slice(0, 5));
    setLogs(recentLogs);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const runAction = async (reason?: string) => {
    if (!actionTarget || !userData) return;
    setActionLoading(true);
    const { opp, type } = actionTarget;

    if (type === 'approve') {
      await opportunityService.approveOpportunity(opp.id);
      await adminService.logAction({
        action: 'opportunity_approved',
        targetType: 'opportunity',
        targetId: opp.id,
        targetLabel: opp.title,
        adminId: userData.id,
        adminName: userData.name,
      });
    } else {
      await opportunityService.rejectOpportunity(opp.id, reason || 'Rejected by admin');
      await adminService.logAction({
        action: 'opportunity_rejected',
        targetType: 'opportunity',
        targetId: opp.id,
        targetLabel: opp.title,
        adminId: userData.id,
        adminName: userData.name,
        details: reason,
      });
    }

    setActionLoading(false);
    setActionTarget(null);
    setPending(prev => prev.filter(o => o.id !== opp.id));
    loadData();
  };

  return (
    <div>
      <AdminHeader title="Dashboard" description="Platform overview and quick actions" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={loading ? '—' : stats?.totalUsers ?? 0} icon={Users} />
          <StatCard
            title="Pending Approval"
            value={loading ? '—' : stats?.pendingOpportunities ?? 0}
            icon={Clock}
            iconClassName="text-yellow-600"
          />
          <StatCard
            title="Published"
            value={loading ? '—' : stats?.publishedOpportunities ?? 0}
            icon={CheckCircle}
            iconClassName="text-green-600"
          />
          <StatCard title="Total Views" value={loading ? '—' : stats?.totalViews ?? 0} icon={Eye} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending approval queue */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Awaiting Approval</CardTitle>
                <CardDescription>Newest opportunities that need a decision</CardDescription>
              </div>
              <Link href="/admin/opportunities?status=pending">
                <Button variant="outline" size="sm">
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!loading && pending.length === 0 ? (
                <EmptyState icon={Clock} title="Nothing pending" description="All caught up — no opportunities waiting for review." />
              ) : (
                <div className="space-y-3">
                  {pending.map((opp) => (
                    <div key={opp.id} className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{opp.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {opp.category} • {opp.city}, {opp.state} • by {opp.postedByName}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => setActionTarget({ opp, type: 'approve' })}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setActionTarget({ opp, type: 'reject' })}>
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest admin actions</CardDescription>
            </CardHeader>
            <CardContent>
              {!loading && logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No admin activity yet.</p>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="text-sm">
                      <p>
                        <span className="font-medium">{log.adminName}</span>{' '}
                        {AUDIT_LABELS[log.action] || log.action}{' '}
                        <span className="font-medium">{log.targetLabel}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Chartered Accountants" value={loading ? '—' : stats?.totalCAs ?? 0} icon={Users} />
          <StatCard title="New Users (7d)" value={loading ? '—' : stats?.newUsersLast7Days ?? 0} icon={Users} />
          <StatCard title="Rejected" value={loading ? '—' : stats?.rejectedOpportunities ?? 0} icon={XCircle} />
          <StatCard title="Interests Expressed" value={loading ? '—' : stats?.totalInterests ?? 0} icon={Heart} />
        </div>
      </div>

      <ConfirmDialog
        open={!!actionTarget}
        onOpenChange={(open) => !open && setActionTarget(null)}
        title={actionTarget?.type === 'approve' ? 'Approve this opportunity?' : 'Reject this opportunity?'}
        description={actionTarget?.opp.title}
        confirmLabel={actionTarget?.type === 'approve' ? 'Approve' : 'Reject'}
        destructive={actionTarget?.type === 'reject'}
        requireReason={actionTarget?.type === 'reject'}
        reasonLabel="Rejection reason"
        loading={actionLoading}
        onConfirm={runAction}
      />
    </div>
  );
}
