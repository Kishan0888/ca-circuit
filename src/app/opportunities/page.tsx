'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, } from '@/components/ui/card';
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

        {/* Opportunities Table / Mobile Cards */}
{loading ? (
  <Card>
    <CardContent className="p-0">
      <div className="hidden md:block">
        <div className="p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-14 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>

      <div className="md:hidden p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </CardContent>
  </Card>
) : opportunities.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-muted-foreground mb-4">
      No opportunities found matching your criteria.
    </p>

    <Button onClick={clearFilters} variant="outline">
      Clear Filters
    </Button>
  </div>
) : (
  <Card className="overflow-hidden">
    <CardContent className="p-0">

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left font-semibold px-5 py-4 min-w-[280px]">
                Opportunity
              </th>

              <th className="text-left font-semibold px-4 py-4 whitespace-nowrap">
                Type
              </th>

              <th className="text-left font-semibold px-4 py-4 whitespace-nowrap">
                Category / Industry
              </th>

              <th className="text-left font-semibold px-4 py-4 whitespace-nowrap">
                Location
              </th>

              <th className="text-left font-semibold px-4 py-4 whitespace-nowrap">
                Investment
              </th>

              <th className="text-right font-semibold px-5 py-4">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {opportunities.map((opportunity, index) => (
              <motion.tr
                key={opportunity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                {/* Opportunity */}
                <td className="px-5 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-heading">
                        {opportunity.title}
                      </span>

                      {opportunity.isFeatured && (
                        <Badge className="bg-gold text-white text-[10px]">
                          Featured
                        </Badge>
                      )}

                      {opportunity.isUrgent && (
                        <Badge variant="destructive" className="text-[10px]">
                          Urgent
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-[360px]">
                      {opportunity.shortDescription}
                    </p>
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge variant="outline" className="capitalize">
  {opportunity.businessType
    ? opportunity.businessType.replace(/-/g, ' ')
    : 'Not Mentioned'}
</Badge>
                </td>

                {/* Category / Industry */}
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium">
                      {opportunity.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {opportunity.industry}
                    </p>
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <p className="font-medium">
                    {opportunity.city}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {opportunity.state}
                  </p>
                </td>

                {/* Investment */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-semibold text-gold">
                    {opportunity.investmentRange}
                  </span>
                </td>

                {/* Action */}
                <td className="px-5 py-4 text-right">
                  <Link
  href={`/opportunities/${opportunity.id}`}
  className="inline-flex items-center justify-center rounded-md bg-gold px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gold/90"
>
  View Details
</Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden divide-y">
        {opportunities.map((opportunity, index) => (
          <motion.div
            key={opportunity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="p-4"
          >
            <div className="space-y-3">

              {/* Title + badges */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-base leading-snug text-heading">
                    {opportunity.title}
                  </h3>

                  {opportunity.isFeatured && (
                    <Badge className="bg-gold text-white text-[10px] shrink-0">
                      Featured
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {opportunity.shortDescription}
                </p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-sm">

                <div>
                  <p className="text-xs text-muted-foreground">
                    Type
                  </p>
                  <p className="font-medium capitalize">
                    {opportunity.businessType.replace('-', ' ')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Category
                  </p>
                  <p className="font-medium truncate">
                    {opportunity.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Location
                  </p>
                  <p className="font-medium">
                    {opportunity.city}, {opportunity.state}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Investment
                  </p>
                  <p className="font-semibold text-gold">
                    {opportunity.investmentRange}
                  </p>
                </div>

              </div>

              {/* Action */}
              <Link
  href={`/opportunities/${opportunity.id}`}
  className="flex w-full items-center justify-center rounded-md bg-gold px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold/90"
>
  View Opportunity
</Link>
            </div>
          </motion.div>
        ))}
      </div>

    </CardContent>
  </Card>
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
