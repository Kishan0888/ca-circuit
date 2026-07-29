'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Briefcase, Clock, CheckCircle, XCircle, TrendingUp, Eye, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { opportunityService } from '@/services/opportunity.service';
import { Opportunity } from '@/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function AdminDashboardContent() {
  const { user, userData } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOpportunities: 0,
    pendingOpportunities: 0,
    publishedOpportunities: 0,
    rejectedOpportunities: 0,
    totalViews: 0,
  });

  if (!userData) return null;

  useEffect(() => {
    const fetchOpportunities = async () => {
      const data = await opportunityService.getOpportunitiesByStatus('pending');
      const published = await opportunityService.getOpportunitiesByStatus('published');
      const rejected = await opportunityService.getOpportunitiesByStatus('rejected');
      setOpportunities([...data, ...published, ...rejected]);
      
      setStats({
        totalUsers: 0,
        totalOpportunities: data.length + published.length + rejected.length,
        pendingOpportunities: data.length,
        publishedOpportunities: published.length,
        rejectedOpportunities: rejected.length,
        totalViews: [...data, ...published, ...rejected].reduce((sum, o) => sum + o.viewCount, 0),
      });
    };

    if (user) {
      fetchOpportunities();
    }
  }, [user]);

  const handleApprove = async (opportunityId: string) => {
    await opportunityService.approveOpportunity(opportunityId);
    const updated = opportunities.map(o => o.id === opportunityId ? { ...o, status: 'published' as const } : o);
    setOpportunities(updated);
  };

  const handleReject = async (opportunityId: string) => {
    await opportunityService.rejectOpportunity(opportunityId, 'Rejected by admin');
    const updated = opportunities.map(o => o.id === opportunityId ? { ...o, status: 'rejected' as const } : o);
    setOpportunities(updated);
  };

  const handleFeature = async (opportunityId: string) => {
    await opportunityService.updateOpportunity(opportunityId, { isFeatured: true });
    const updated = opportunities.map(o => o.id === opportunityId ? { ...o, isFeatured: !o.isFeatured } : o);
    setOpportunities(updated);
  };

  const pendingOpportunities = opportunities.filter(o => o.status === 'pending');
  const publishedOpportunities = opportunities.filter(o => o.status === 'published');
  const rejectedOpportunities = opportunities.filter(o => o.status === 'rejected');

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold text-heading mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage platform content and users</p>
            </div>
            <Button variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOpportunities}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedOpportunities}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending ({pendingOpportunities.length})</TabsTrigger>
              <TabsTrigger value="published">Published ({publishedOpportunities.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedOpportunities.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Pending Tab */}
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Opportunities</CardTitle>
                  <CardDescription>Opportunities awaiting admin approval</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingOpportunities.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No pending opportunities</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingOpportunities.map((opp) => (
                        <div key={opp.id} className="p-4 border rounded-lg space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{opp.title}</h3>
                              <p className="text-sm text-muted-foreground">{opp.category} • {opp.city}, {opp.state}</p>
                              <p className="text-sm text-muted-foreground mt-2">Posted by: {opp.postedByName}</p>
                            </div>
                            <Badge variant="secondary">{opp.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{opp.shortDescription}</p>
                          <div className="flex gap-2">
                            <Link href={`/opportunities/${opp.id}`}>
                              <Button variant="outline" size="sm">View Details</Button>
                            </Link>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(opp.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(opp.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Published Tab */}
            <TabsContent value="published">
              <Card>
                <CardHeader>
                  <CardTitle>Published Opportunities</CardTitle>
                  <CardDescription>Live opportunities on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {publishedOpportunities.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No published opportunities</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {publishedOpportunities.map((opp) => (
                        <div key={opp.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{opp.title}</p>
                            <p className="text-sm text-muted-foreground">{opp.category} • {opp.city}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{opp.viewCount} views</p>
                              <p className="text-xs text-muted-foreground">{opp.interestedCount} interested</p>
                            </div>
                            <Button
                              variant={opp.isFeatured ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleFeature(opp.id)}
                            >
                              {opp.isFeatured ? 'Featured' : 'Feature'}
                            </Button>
                            <Link href={`/opportunities/${opp.id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rejected Tab */}
            <TabsContent value="rejected">
              <Card>
                <CardHeader>
                  <CardTitle>Rejected Opportunities</CardTitle>
                  <CardDescription>Opportunities that were not approved</CardDescription>
                </CardHeader>
                <CardContent>
                  {rejectedOpportunities.length === 0 ? (
                    <div className="text-center py-12">
                      <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No rejected opportunities</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rejectedOpportunities.map((opp) => (
                        <div key={opp.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{opp.title}</p>
                            <p className="text-sm text-muted-foreground">{opp.category} • {opp.city}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(opp.id)}
                            >
                              Approve
                            </Button>
                            <Link href={`/opportunities/${opp.id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Users</span>
                      <span className="font-semibold">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Opportunities</span>
                      <span className="font-semibold">{stats.totalOpportunities}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Views</span>
                      <span className="font-semibold">{stats.totalViews}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Approval Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-center py-8">
                      {stats.totalOpportunities > 0 
                        ? Math.round((stats.publishedOpportunities / stats.totalOpportunities) * 100)
                        : 0}%
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      {stats.publishedOpportunities} of {stats.totalOpportunities} approved
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
