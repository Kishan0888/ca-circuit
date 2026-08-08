'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Heart,
  Eye,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  User as UserIcon,
} from 'lucide-react';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { interestService } from '@/services/interest.service';
import { opportunityService } from '@/services/opportunity.service';
import { authService } from '@/services/auth.service';

import { Interest, Opportunity, User } from '@/types';

type InterestWithDetails = Interest & {
  user?: User;
  opportunity?: Opportunity;
};

export default function AdminInterestsPage() {
  const [interests, setInterests] = useState<InterestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInterest, setSelectedInterest] =
    useState<InterestWithDetails | null>(null);

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      setLoading(true);

      const allInterests = await interestService.getAllInterests();

      const enriched = await Promise.all(
  allInterests.map(async (interest) => {
    let user: User | undefined;
    let opportunity: Opportunity | undefined;

    try {
user = (await authService.getUserData(interest.userId)) ?? undefined;    } catch (error) {
      console.error('Error fetching user:', error);
    }

    try {
     opportunity =
  (await opportunityService.getOpportunityById(
    interest.opportunityId
  )) ?? undefined;
    } catch (error) {
      console.error('Error fetching opportunity:', error);
    }

    return {
      ...interest,
      user,
      opportunity,
    };
  })
);
      setInterests(enriched);
    } catch (error) {
      console.error('Error loading interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterests = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return interests;

    return interests.filter((interest) => {
      return (
        interest.user?.name?.toLowerCase().includes(term) ||
        interest.user?.email?.toLowerCase().includes(term) ||
        interest.user?.phone?.toLowerCase().includes(term) ||
        interest.opportunity?.title?.toLowerCase().includes(term) ||
        interest.opportunity?.city?.toLowerCase().includes(term) ||
        interest.opportunity?.state?.toLowerCase().includes(term)
      );
    });
  }, [interests, search]);

  const getStatusVariant = (
    status: Interest['status']
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '—';

    try {
      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  return (
    <div>
      <AdminHeader
        title="Interests"
        description={`${interests.length} total interests`}
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search by user, opportunity, email, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Interests List */}
        <Card>
          <CardContent className="p-0">
            {!loading && filteredInterests.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={Heart}
                  title="No interests found"
                  description={
                    search
                      ? 'Try a different search term.'
                      : 'No users have expressed interest yet.'
                  }
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="p-4">
                        <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2 mt-2" />
                      </div>
                    ))
                  : filteredInterests.map((interest) => (
                      <div
                        key={interest.id}
                        className="p-4 flex flex-col lg:flex-row lg:items-center gap-4"
                      >
                        {/* User */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />

                            <p className="font-medium truncate">
                              {interest.user?.name || 'Unknown User'}
                            </p>

                            <Badge
                              variant={getStatusVariant(interest.status)}
                            >
                              {interest.status}
                            </Badge>
                          </div>

                          <div className="mt-1 space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {interest.user?.email || 'Email not available'}
                            </p>

                            {interest.user?.phone && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {interest.user.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Opportunity */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {interest.opportunity?.title ||
                              'Opportunity unavailable'}
                          </p>

                          {interest.opportunity && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {interest.opportunity.city},{' '}
                              {interest.opportunity.state}
                            </p>
                          )}
                        </div>

                        {/* Date */}
                        <div className="text-sm text-muted-foreground flex items-center gap-1 shrink-0">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(interest.createdAt)}
                        </div>

                        {/* Action */}
                        <div className="shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedInterest(interest)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        {selectedInterest && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    Interest Details
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Complete information about this interest
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInterest(null)}
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Details */}
                <div className="rounded-lg border p-4 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Interested User
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {selectedInterest.user?.name || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {selectedInterest.user?.email || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {selectedInterest.user?.phone || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Company</p>
                      <p className="font-medium">
                        {selectedInterest.user?.companyName || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Designation</p>
                      <p className="font-medium">
                        {selectedInterest.user?.designation || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {selectedInterest.user?.city || '—'}
                        {selectedInterest.user?.state
                          ? `, ${selectedInterest.user.state}`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opportunity Details */}
                <div className="rounded-lg border p-4 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Opportunity
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Title</p>
                      <p className="font-medium">
                        {selectedInterest.opportunity?.title || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">
                        {selectedInterest.opportunity?.category || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Industry</p>
                      <p className="font-medium">
                        {selectedInterest.opportunity?.industry || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Business Type</p>
                      <p className="font-medium">
                        {selectedInterest.opportunity?.businessType || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {selectedInterest.opportunity?.city || '—'}
                        {selectedInterest.opportunity?.state
                          ? `, ${selectedInterest.opportunity.state}`
                          : ''}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">
                        Investment Range
                      </p>
                      <p className="font-medium">
                        {selectedInterest.opportunity?.investmentRange || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interest Information */}
              <div className="rounded-lg border p-4 mt-6">
                <h3 className="font-semibold mb-4">Interest Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge
                      variant={getStatusVariant(selectedInterest.status)}
                      className="mt-1"
                    >
                      {selectedInterest.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Interested On</p>
                    <p className="font-medium mt-1">
                      {formatDate(selectedInterest.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Message</p>
                    <p className="font-medium mt-1">
                      {selectedInterest.message || 'No message provided'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}