'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Building2, DollarSign, Calendar, User, Bookmark, Share2, Lock, Mail, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useOpportunity } from '@/hooks/useOpportunities';
import { useBookmarkStatus } from '@/hooks/useBookmarks';
import { useInterestStatus } from '@/hooks/useInterests';
import { bookmarkService } from '@/services/bookmark.service';
import { interestService } from '@/services/interest.service';
import { opportunityService } from '@/services/opportunity.service';
import { INVESTMENT_RANGES } from '@/constants';

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userData } = useAuth();
  const { opportunity, loading } = useOpportunity(params.id as string);
  const { isBookmarked, setIsBookmarked } = useBookmarkStatus(user?.uid || '', params.id as string);
  const { hasInterest, setHasInterest } = useInterestStatus(user?.uid || '', params.id as string);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    if (opportunity) {
      opportunityService.incrementViewCount(opportunity.id);
    }
  }, [opportunity]);

  const handleBookmark = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (isBookmarked) {
      await bookmarkService.removeBookmark(user.uid, opportunity!.id);
      await opportunityService.decrementBookmarkCount(opportunity!.id);
    } else {
      await bookmarkService.addBookmark(user.uid, opportunity!.id);
      await opportunityService.incrementBookmarkCount(opportunity!.id);
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleInterest = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (hasInterest) {
      await interestService.removeInterest(user.uid, opportunity!.id);
      await opportunityService.decrementInterestedCount(opportunity!.id);
    } else {
      await interestService.addInterest(user.uid, opportunity!.id);
      await opportunityService.incrementInterestedCount(opportunity!.id);
    }
    setHasInterest(!hasInterest);
  };

  const getInvestmentLabel = (range: string) => {
    const found = INVESTMENT_RANGES.find(r => r.value === range);
    return found?.label || range;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading opportunity...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Opportunity not found</p>
          <Link href="/opportunities">
            <Button>Back to Opportunities</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = !user;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/opportunities">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Opportunities
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2">
                  <Badge variant="secondary">{opportunity.category}</Badge>
                  {opportunity.isFeatured && <Badge className="bg-gold text-white">Featured</Badge>}
                  {opportunity.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleBookmark}>
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-gold text-gold' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <h1 className="font-heading text-4xl font-bold text-heading mb-4">{opportunity.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{opportunity.shortDescription}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Posted by {opportunity.postedByName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(opportunity.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{opportunity.viewCount} views</span>
                </div>
              </div>
            </motion.div>

            {/* Image */}
            {opportunity.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Opportunity Image</span>
                </div>
              </motion.div>
            )}

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Opportunity Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Industry</p>
                        <p className="font-medium">{opportunity.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{opportunity.city}, {opportunity.state}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Investment Range</p>
                        <p className="font-medium">{getInvestmentLabel(opportunity.investmentRange)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Business Type</p>
                        <p className="font-medium">{opportunity.businessType}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`prose max-w-none ${isLocked ? 'blur-sm select-none' : ''}`}>
                    <p className="text-muted-foreground whitespace-pre-line">{opportunity.description}</p>
                  </div>
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Requirements */}
            {opportunity.requirements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`prose max-w-none ${isLocked ? 'blur-sm select-none' : ''}`}>
                      <p className="text-muted-foreground whitespace-pre-line">{opportunity.requirements}</p>
                    </div>
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Documents */}
            {opportunity.documents && opportunity.documents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={isLocked ? 'blur-sm select-none' : ''}>
                      {opportunity.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg mb-2">
                          <span className="text-sm">Document {index + 1}</span>
                          <Button variant="outline" size="sm" disabled={isLocked}>
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    {isLocked ? 'Login to view contact details' : 'Get in touch with the opportunity poster'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLocked ? (
                    <div className="text-center py-8">
                      <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Create a free account to unlock complete opportunity details and contact information
                      </p>
                      <Button onClick={() => setShowLoginDialog(true)} className="w-full bg-gold hover:bg-gold/90 text-white">
                        Login or Register
                      </Button>
                    </div>
                  ) : (
                    <>
                      {opportunity.contactPreference === 'email' || opportunity.contactPreference === 'both' ? (
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{opportunity.contactEmail || 'Contact for details'}</p>
                          </div>
                        </div>
                      ) : null}
                      {opportunity.contactPreference === 'phone' || opportunity.contactPreference === 'both' ? (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{opportunity.contactPhone || 'Contact for details'}</p>
                          </div>
                        </div>
                      ) : null}
                      <Button className="w-full bg-gold hover:bg-gold/90 text-white">
                        Send Message
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            {!isLocked && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleInterest}
                  variant={hasInterest ? 'outline' : 'default'}
                  className="w-full"
                  size="lg"
                >
                  {hasInterest ? 'Remove Interest' : 'Mark as Interested'}
                </Button>
              </motion.div>
            )}

            {/* Posted By */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Posted By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{opportunity.postedByName}</p>
                      <p className="text-sm text-muted-foreground">Verified CA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Login Dialog */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                You need to create a free account to unlock complete opportunity details and contact information.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setShowLoginDialog(false)}>
                <Button className="w-full bg-gold hover:bg-gold/90 text-white">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setShowLoginDialog(false)}>
                <Button variant="outline" className="w-full">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
