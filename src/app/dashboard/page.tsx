'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Briefcase, Bookmark, Settings, Plus, TrendingUp, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useUserOpportunities } from '@/hooks/useOpportunities';
import { useBookmarks } from '@/hooks/useBookmarks';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function DashboardContent() {
  const { user, userData } = useAuth();
  const { opportunities } = useUserOpportunities(user?.uid || '');
  const { bookmarks } = useBookmarks(user?.uid || '');

  if (!userData) return null;

  const draftOpportunities = opportunities.filter(o => o.status === 'draft');
  const pendingOpportunities = opportunities.filter(o => o.status === 'pending');
  const approvedOpportunities = opportunities.filter(o => o.status === 'published');
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
              <h1 className="font-heading text-4xl font-bold text-heading mb-2">
                Welcome back, {userData.name}
              </h1>
              <p className="text-muted-foreground">
                {userData.role === 'ca' ? 'Chartered Accountant' : 'Professional'} Dashboard
              </p>
            </div>
            {userData.role === 'ca' && (
              <Link href="/dashboard/create-opportunity">
                <Button className="bg-gold hover:bg-gold/90 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Opportunity
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{opportunities.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedOpportunities.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOpportunities.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.length}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="opportunities">My Opportunities</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Opportunities</CardTitle>
                    <CardDescription>Your latest posted opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {opportunities.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No opportunities yet. Create your first opportunity!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {opportunities.slice(0, 5).map((opp) => (
                          <div key={opp.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{opp.title}</p>
                              <p className="text-sm text-muted-foreground">{opp.category}</p>
                            </div>
                            <Badge
                              variant={
                                opp.status === 'published' ? 'default' :
                                opp.status === 'pending' ? 'secondary' :
                                opp.status === 'rejected' ? 'destructive' : 'outline'
                              }
                            >
                              {opp.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userData.role === 'ca' && (
                      <Link href="/dashboard/create-opportunity">
                        <Button variant="outline" className="w-full justify-start">
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Opportunity
                        </Button>
                      </Link>
                    )}
                    <Link href="/opportunities">
                      <Button variant="outline" className="w-full justify-start">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Browse Opportunities
                      </Button>
                    </Link>
                    <Link href="/dashboard/bookmarks">
                      <Button variant="outline" className="w-full justify-start">
                        <Bookmark className="mr-2 h-4 w-4" />
                        View Bookmarks
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">All</CardTitle>
                    <CardDescription>{opportunities.length} opportunities</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      Pending
                    </CardTitle>
                    <CardDescription>{pendingOpportunities.length} awaiting approval</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Published
                    </CardTitle>
                    <CardDescription>{approvedOpportunities.length} live</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Rejected
                    </CardTitle>
                    <CardDescription>{rejectedOpportunities.length} rejected</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  {opportunities.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No opportunities yet</p>
                      {userData.role === 'ca' && (
                        <Link href="/dashboard/create-opportunity">
                          <Button className="bg-gold hover:bg-gold/90 text-white">
                            Create Your First Opportunity
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {opportunities.map((opp) => (
                        <div key={opp.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{opp.title}</p>
                            <p className="text-sm text-muted-foreground">{opp.category} • {opp.city}</p>
                          </div>
                          <Badge
                            variant={
                              opp.status === 'published' ? 'default' :
                              opp.status === 'pending' ? 'secondary' :
                              opp.status === 'rejected' ? 'destructive' : 'outline'
                            }
                          >
                            {opp.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Opportunities</CardTitle>
                  <CardDescription>Opportunities you've bookmarked for later</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-12">
                      <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No bookmarked opportunities yet</p>
                      <Link href="/opportunities">
                        <Button variant="outline">Browse Opportunities</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookmarks.map((bookmark) => (
                        <div key={bookmark.id} className="p-4 border rounded-lg">
                          <p className="font-medium">Bookmarked Opportunity</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(bookmark.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-lg">{userData.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-lg">{userData.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <p className="text-lg capitalize">{userData.role}</p>
                  </div>
                  {userData.companyName && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <p className="text-lg">{userData.companyName}</p>
                    </div>
                  )}
                  {userData.designation && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Designation</label>
                      <p className="text-lg">{userData.designation}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <p className="text-lg">{userData.city ? `${userData.city}, ${userData.state}` : 'Not specified'}</p>
                  </div>
                  <div className="pt-4">
                    <Button>Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email updates about new opportunities</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Privacy Settings</p>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your password</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['registered', 'ca']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
