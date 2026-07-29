'use client';

import { useState, useEffect } from 'react';
import { opportunityService } from '@/services/opportunity.service';
import { Opportunity, SearchQuery } from '@/types';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublishedOpportunities = async (limitCount: number = 12) => {
    setLoading(true);
    setError(null);
    try {
      const { opportunities: data } = await opportunityService.getPublishedOpportunities(undefined, limitCount);
      setOpportunities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedOpportunities = async (limitCount: number = 6) => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityService.getFeaturedOpportunities(limitCount);
      setOpportunities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchOpportunities = async (searchQuery: SearchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityService.searchOpportunities(searchQuery);
      setOpportunities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedOpportunities();
  }, []);

  return {
    opportunities,
    loading,
    error,
    fetchPublishedOpportunities,
    fetchFeaturedOpportunities,
    searchOpportunities,
    refetch: () => fetchPublishedOpportunities(),
  };
}

export function useOpportunity(id: string) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await opportunityService.getOpportunityById(id);
        setOpportunity(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOpportunity();
    }
  }, [id]);

  return { opportunity, loading, error };
}

export function useUserOpportunities(userId: string) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserOpportunities = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await opportunityService.getOpportunitiesByUser(userId);
        setOpportunities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserOpportunities();
    }
  }, [userId]);

  return { opportunities, loading, error, refetch: () => opportunityService.getOpportunitiesByUser(userId).then(setOpportunities) };
}
