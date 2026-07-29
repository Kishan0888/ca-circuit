'use client';

import { useState, useEffect } from 'react';
import { interestService } from '@/services/interest.service';
import { Interest } from '@/types';

export function useInterests(userId: string) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await interestService.getUserInterests(userId);
        setInterests(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchInterests();
    }
  }, [userId]);

  const addInterest = async (opportunityId: string, message?: string) => {
    const result = await interestService.addInterest(userId, opportunityId, message);
    if (result.success) {
      const data = await interestService.getUserInterests(userId);
      setInterests(data);
    }
    return result;
  };

  const removeInterest = async (opportunityId: string) => {
    const result = await interestService.removeInterest(userId, opportunityId);
    if (result.success) {
      const data = await interestService.getUserInterests(userId);
      setInterests(data);
    }
    return result;
  };

  const hasInterest = async (opportunityId: string) => {
    return await interestService.hasInterest(userId, opportunityId);
  };

  return {
    interests,
    loading,
    error,
    addInterest,
    removeInterest,
    hasInterest,
    refetch: () => interestService.getUserInterests(userId).then(setInterests),
  };
}

export function useInterestStatus(userId: string, opportunityId: string) {
  const [hasInterest, setHasInterest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setLoading(true);
      const status = await interestService.hasInterest(userId, opportunityId);
      setHasInterest(status);
      setLoading(false);
    };

    if (userId && opportunityId) {
      checkStatus();
    }
  }, [userId, opportunityId]);

  return { hasInterest, loading, setHasInterest };
}
