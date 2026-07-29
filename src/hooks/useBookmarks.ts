'use client';

import { useState, useEffect } from 'react';
import { bookmarkService } from '@/services/bookmark.service';
import { Bookmark } from '@/types';

export function useBookmarks(userId: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await bookmarkService.getUserBookmarks(userId);
        setBookmarks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  const addBookmark = async (opportunityId: string) => {
    const result = await bookmarkService.addBookmark(userId, opportunityId);
    if (result.success) {
      const data = await bookmarkService.getUserBookmarks(userId);
      setBookmarks(data);
    }
    return result;
  };

  const removeBookmark = async (opportunityId: string) => {
    const result = await bookmarkService.removeBookmark(userId, opportunityId);
    if (result.success) {
      const data = await bookmarkService.getUserBookmarks(userId);
      setBookmarks(data);
    }
    return result;
  };

  const isBookmarked = async (opportunityId: string) => {
    return await bookmarkService.isBookmarked(userId, opportunityId);
  };

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refetch: () => bookmarkService.getUserBookmarks(userId).then(setBookmarks),
  };
}

export function useBookmarkStatus(userId: string, opportunityId: string) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setLoading(true);
      const status = await bookmarkService.isBookmarked(userId, opportunityId);
      setIsBookmarked(status);
      setLoading(false);
    };

    if (userId && opportunityId) {
      checkStatus();
    }
  }, [userId, opportunityId]);

  return { isBookmarked, loading, setIsBookmarked };
}
