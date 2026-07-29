import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sortByCreatedAtDesc } from '@/lib/firestore-utils';
import { Bookmark } from '@/types';

export const bookmarkService = {
  // Add bookmark
  async addBookmark(userId: string, opportunityId: string) {
    try {
      const bookmarkData: Partial<Bookmark> = {
        userId,
        opportunityId,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'bookmarks'), bookmarkData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Remove bookmark
  async removeBookmark(userId: string, opportunityId: string) {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const bookmarkDoc = querySnapshot.docs.find(
        doc => doc.data().opportunityId === opportunityId
      );
      
      if (bookmarkDoc) {
        await deleteDoc(doc(db, 'bookmarks', bookmarkDoc.id));
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Check if opportunity is bookmarked by user
  async isBookmarked(userId: string, opportunityId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.some(doc => doc.data().opportunityId === opportunityId);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  },

  // Get all bookmarks for a user
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      return sortByCreatedAtDesc(
        querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bookmark))
      );
    } catch (error) {
      console.error('Error fetching user bookmarks:', error);
      return [];
    }
  },

  // Get bookmark count for an opportunity
  async getBookmarkCount(opportunityId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('opportunityId', '==', opportunityId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error fetching bookmark count:', error);
      return 0;
    }
  },
};
