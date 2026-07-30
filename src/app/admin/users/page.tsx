'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Users as UsersIcon, ShieldCheck, ShieldOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { adminService } from '@/services/admin.service';
import { User, UserRole } from '@/types';

const PAGE_SIZE = 10;

const ROLE_LABELS: Record<UserRole, string> = {
  visitor: 'Visitor',
  registered: 'Registered',
  ca: 'Chartered Accountant',
  admin: 'Admin',
};

function formatDate(value: User['createdAt']): string {
  const d = value instanceof Date ? value : (value as { toDate?: () => Date } | undefined)?.toDate?.();
  if (!d) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminUsersPage() {
  const { userData: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [page, setPage] = useState(1);
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const data = await adminService.getAllUsers();
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !term || u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const handleRoleChange = async (user: User, role: UserRole) => {
    if (!currentAdmin) return;
    setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, role } : u)));
    await adminService.updateUserRole(user.id, role);
    await adminService.logAction({
      action: 'user_role_changed',
      targetType: 'user',
      targetId: user.id,
      targetLabel: user.name || user.email,
      adminId: currentAdmin.id,
      adminName: currentAdmin.name,
      details: `Role changed to ${role}`,
    });
  };

  const handleToggleVerified = async (user: User) => {
    const next = !user.isVerified;
    setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, isVerified: next } : u)));
    await adminService.setUserVerified(user.id, next);
  };

  const confirmSuspend = async () => {
    if (!suspendTarget || !currentAdmin) return;
    setActionLoading(true);
    const next = !suspendTarget.isSuspended;
    await adminService.setUserSuspended(suspendTarget.id, next);
    await adminService.logAction({
      action: next ? 'user_suspended' : 'user_reactivated',
      targetType: 'user',
      targetId: suspendTarget.id,
      targetLabel: suspendTarget.name || suspendTarget.email,
      adminId: currentAdmin.id,
      adminName: currentAdmin.name,
    });
    setUsers(prev => prev.map(u => (u.id === suspendTarget.id ? { ...u, isSuspended: next } : u)));
    setActionLoading(false);
    setSuspendTarget(null);
  };

  return (
    <div>
      <AdminHeader title="Users" description={`${users.length} registered users`} />

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as 'all' | UserRole)}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
              <SelectItem value="ca">Chartered Accountant</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {!loading && filtered.length === 0 ? (
              <div className="p-6">
                <EmptyState icon={UsersIcon} title="No users found" description="Try a different search or filter." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wide">
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium hidden md:table-cell">Joined</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium hidden sm:table-cell">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b border-border/60 last:border-0">
                            <td className="px-4 py-4" colSpan={5}>
                              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                            </td>
                          </tr>
                        ))
                      : paginated.map((user) => {
                          const initials = (user.name || user.email || '?')
                            .split(' ')
                            .map(p => p[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase();
                          const isSelf = currentAdmin?.id === user.id;
                          return (
                            <tr key={user.id} className="border-b border-border/60 last:border-0 align-middle">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarImage src={user.profileImage} alt={user.name} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <p className="font-medium truncate">{user.name || 'Unnamed'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                                {formatDate(user.createdAt)}
                              </td>
                              <td className="px-4 py-3">
                                <Select
                                  value={user.role}
                                  onValueChange={(value) => handleRoleChange(user, value as UserRole)}
                                  disabled={isSelf}
                                >
                                  <SelectTrigger className="w-[170px]">
                                    <SelectValue placeholder="Select role">{ROLE_LABELS[user.role]}</SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="registered">Registered</SelectItem>
                                    <SelectItem value="ca">Chartered Accountant</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-4 py-3 hidden sm:table-cell">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <Badge
                                    variant={user.isVerified ? 'default' : 'outline'}
                                    className="cursor-pointer"
                                    onClick={() => handleToggleVerified(user)}
                                  >
                                    {user.isVerified ? 'Verified' : 'Unverified'}
                                  </Badge>
                                  {user.isSuspended && <Badge variant="destructive">Suspended</Badge>}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isSelf}
                                  onClick={() => setSuspendTarget(user)}
                                >
                                  {user.isSuspended ? (
                                    <>
                                      <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                      Reactivate
                                    </>
                                  ) : (
                                    <>
                                      <ShieldOff className="h-3.5 w-3.5 mr-1" />
                                      Suspend
                                    </>
                                  )}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title={suspendTarget?.isSuspended ? 'Reactivate this user?' : 'Suspend this user?'}
        description={
          suspendTarget?.isSuspended
            ? `${suspendTarget?.name} will regain full access to the platform.`
            : `${suspendTarget?.name} will lose access to the platform until reactivated.`
        }
        confirmLabel={suspendTarget?.isSuspended ? 'Reactivate' : 'Suspend'}
        destructive={!suspendTarget?.isSuspended}
        loading={actionLoading}
        onConfirm={confirmSuspend}
      />
    </div>
  );
}
