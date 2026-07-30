'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Briefcase,
  CheckCircle,
  XCircle,
  Star,
  Trash2,
  Pencil,
  Eye,
  Plus,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { opportunityService } from '@/services/opportunity.service';
import { adminService } from '@/services/admin.service';
import { Opportunity, OpportunityStatus } from '@/types';
import { CATEGORIES } from '@/constants';

const STATUS_TABS: { value: 'all' | OpportunityStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

const STATUS_BADGE: Record<OpportunityStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  approved: 'secondary',
  published: 'default',
  rejected: 'destructive',
  draft: 'outline',
  archived: 'outline',
};

type ActionType = 'approve' | 'reject' | 'delete';

function AdminOpportunitiesContent() {
  const { userData } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState<'all' | OpportunityStatus>(
    (searchParams.get('status') as OpportunityStatus) || 'all'
  );
  const [actionTarget, setActionTarget] = useState<{ opp: Opportunity; type: ActionType } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await opportunityService.getAllOpportunities();
    setOpportunities(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return opportunities.filter((opp) => {
      const matchesStatus = status === 'all' || opp.status === status;
      const matchesCategory = category === 'all' || opp.category === category;
      const matchesSearch =
        !term ||
        opp.title?.toLowerCase().includes(term) ||
        opp.postedByName?.toLowerCase().includes(term) ||
        opp.city?.toLowerCase().includes(term);
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [opportunities, status, category, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: opportunities.length };
    for (const opp of opportunities) {
      map[opp.status] = (map[opp.status] || 0) + 1;
    }
    return map;
  }, [opportunities]);

  const handleStatusTab = (value: string) => {
    setStatus(value as 'all' | OpportunityStatus);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete('status');
    else params.set('status', value);
    router.replace(`/admin/opportunities${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const toggleFeatured = async (opp: Opportunity) => {
    setOpportunities(prev => prev.map(o => (o.id === opp.id ? { ...o, isFeatured: !o.isFeatured } : o)));
    await opportunityService.setFeatured(opp.id, !opp.isFeatured);
    if (userData) {
      await adminService.logAction({
        action: opp.isFeatured ? 'opportunity_unfeatured' : 'opportunity_featured',
        targetType: 'opportunity',
        targetId: opp.id,
        targetLabel: opp.title,
        adminId: userData.id,
        adminName: userData.name,
      });
    }
  };

  const runAction = async (reason?: string) => {
    if (!actionTarget || !userData) return;
    setActionLoading(true);
    const { opp, type } = actionTarget;

    if (type === 'approve') {
      await opportunityService.approveOpportunity(opp.id);
      setOpportunities(prev => prev.map(o => (o.id === opp.id ? { ...o, status: 'published' } : o)));
      await adminService.logAction({
        action: 'opportunity_approved',
        targetType: 'opportunity',
        targetId: opp.id,
        targetLabel: opp.title,
        adminId: userData.id,
        adminName: userData.name,
      });
    } else if (type === 'reject') {
      await opportunityService.rejectOpportunity(opp.id, reason || 'Rejected by admin');
      setOpportunities(prev => prev.map(o => (o.id === opp.id ? { ...o, status: 'rejected' } : o)));
      await adminService.logAction({
        action: 'opportunity_rejected',
        targetType: 'opportunity',
        targetId: opp.id,
        targetLabel: opp.title,
        adminId: userData.id,
        adminName: userData.name,
        details: reason,
      });
    } else if (type === 'delete') {
      await opportunityService.deleteOpportunity(opp.id);
      setOpportunities(prev => prev.filter(o => o.id !== opp.id));
      await adminService.logAction({
        action: 'opportunity_deleted',
        targetType: 'opportunity',
        targetId: opp.id,
        targetLabel: opp.title,
        adminId: userData.id,
        adminName: userData.name,
      });
    }

    setActionLoading(false);
    setActionTarget(null);
  };

  return (
    <div>
      <AdminHeader title="Opportunities" description={`${opportunities.length} total opportunities`} />

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs value={status} onValueChange={handleStatusTab}>
            <TabsList className="flex-wrap h-auto">
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label} ({counts[tab.value] || 0})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Link href="/admin/opportunities/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Opportunity
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, poster, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={(v) => setCategory(v || 'all')}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {!loading && filtered.length === 0 ? (
              <div className="p-6">
                <EmptyState icon={Briefcase} title="No opportunities found" description="Try a different filter or search term." />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-4">
                        <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                      </div>
                    ))
                  : filtered.map((opp) => (
                      <div key={opp.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium truncate">{opp.title}</p>
                            <Badge variant={STATUS_BADGE[opp.status]}>{opp.status}</Badge>
                            {opp.isFeatured && (
                              <Badge variant="outline" className="text-gold border-gold">
                                <Star className="h-3 w-3 mr-1 fill-gold text-gold" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {opp.category} • {opp.city}, {opp.state} • by {opp.postedByName} •{' '}
                            {opp.viewCount || 0} views
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                          {opp.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => setActionTarget({ opp, type: 'approve' })}
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => setActionTarget({ opp, type: 'reject' })}>
                                <XCircle className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant={opp.isFeatured ? 'default' : 'outline'}
                            onClick={() => toggleFeatured(opp)}
                            title={opp.isFeatured ? 'Unfeature' : 'Feature'}
                          >
                            <Star className="h-3.5 w-3.5" />
                          </Button>
                          {opp.status === 'published' && (
                            <Link href={`/opportunities/${opp.id}`} target="_blank">
                              <Button size="sm" variant="outline" title="Preview live listing">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/opportunities/${opp.id}/edit`}>
                            <Button size="sm" variant="outline" title="Edit">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setActionTarget({ opp, type: 'delete' })}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!actionTarget}
        onOpenChange={(open) => !open && setActionTarget(null)}
        title={
          actionTarget?.type === 'approve'
            ? 'Approve this opportunity?'
            : actionTarget?.type === 'reject'
            ? 'Reject this opportunity?'
            : 'Delete this opportunity?'
        }
        description={
          actionTarget?.type === 'delete'
            ? `"${actionTarget?.opp.title}" will be permanently removed. This cannot be undone.`
            : actionTarget?.opp.title
        }
        confirmLabel={
          actionTarget?.type === 'approve' ? 'Approve' : actionTarget?.type === 'reject' ? 'Reject' : 'Delete'
        }
        destructive={actionTarget?.type !== 'approve'}
        requireReason={actionTarget?.type === 'reject'}
        reasonLabel="Rejection reason"
        loading={actionLoading}
        onConfirm={runAction}
      />
    </div>
  );
}

export default function AdminOpportunitiesPage() {
  return (
    <Suspense fallback={null}>
      <AdminOpportunitiesContent />
    </Suspense>
  );
}
