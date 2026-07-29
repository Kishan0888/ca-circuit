'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORIES, INDUSTRIES, INVESTMENT_RANGES, BUSINESS_TYPES } from '@/constants';
import { SearchQuery, FilterOptions } from '@/types';

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { opportunities, loading, searchOpportunities } = useOpportunities();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: searchParams.get('category') || undefined,
    industry: undefined,
    investmentRange: undefined,
    location: undefined,
    businessType: undefined,
  });
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'investment_high' | 'investment_low'>('latest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const query: SearchQuery = {
      query: searchQuery,
      filters,
      sortBy,
    };
    searchOpportunities(query);
  }, [searchQuery, filters, sortBy]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl font-bold text-heading mb-2">Opportunity Feed</h1>
          <p className="text-lg text-muted-foreground">Discover business opportunities from verified Chartered Accountants</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search opportunities by title, industry, or location..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger render={<Button variant="outline" className="h-12" />}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {(filters.category || filters.industry || filters.investmentRange || filters.location || filters.businessType) && (
                    <Badge className="ml-2 bg-gold text-white">Active</Badge>
                  )}
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Opportunities</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={filters.category ?? ''} onValueChange={(value) => handleFilterChange('category', value || undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Industry</label>
                    <Select value={filters.industry ?? ''} onValueChange={(value) => handleFilterChange('industry', value || undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Industries</SelectItem>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Investment Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Investment Range</label>
                    <Select value={filters.investmentRange ?? ''} onValueChange={(value) => handleFilterChange('investmentRange', value || undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Ranges</SelectItem>
                        {INVESTMENT_RANGES.map((range) => (
                          <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Type</label>
                    <Select value={filters.businessType ?? ''} onValueChange={(value) => handleFilterChange('businessType', value || undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input
                      placeholder="Enter city or state"
                      value={filters.location ?? ''}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={clearFilters} variant="outline" className="flex-1">
                      Clear All
                    </Button>
                    <Button onClick={() => setIsFilterOpen(false)} className="flex-1 bg-gold hover:bg-gold/90 text-white">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="h-12 w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="investment_high">Investment: High to Low</SelectItem>
                <SelectItem value="investment_low">Investment: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(filters.category || filters.industry || filters.investmentRange || filters.location || filters.businessType) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.category && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('category', '')}>
                  Category: {filters.category} ✕
                </Badge>
              )}
              {filters.industry && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('industry', '')}>
                  Industry: {filters.industry} ✕
                </Badge>
              )}
              {filters.investmentRange && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('investmentRange', '')}>
                  Investment: {filters.investmentRange} ✕
                </Badge>
              )}
              {filters.businessType && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('businessType', '')}>
                  Type: {filters.businessType} ✕
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('location', '')}>
                  Location: {filters.location} ✕
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm text-muted-foreground">
            Showing {opportunities.length} opportunities
          </p>
        </motion.div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading opportunities...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No opportunities found matching your criteria.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  {opportunity.images.length > 0 && (
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-t-lg" />
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{opportunity.category}</Badge>
                      {opportunity.isFeatured && <Badge className="bg-gold text-white">Featured</Badge>}
                      {opportunity.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{opportunity.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{opportunity.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Industry</span>
                        <span className="font-medium">{opportunity.industry}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{opportunity.city}, {opportunity.state}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Investment</span>
                        <span className="font-medium">{opportunity.investmentRange}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-3 border-t">
                        <span className="text-muted-foreground">Posted by</span>
                        <span className="font-medium">{opportunity.postedByName}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading opportunities...</p>
      </div>
    }>
      <OpportunitiesContent />
    </Suspense>
  );
}
