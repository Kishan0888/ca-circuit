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
import { Interest } from '@/types';

export const interestService = {
  // Add interest
async addInterest(userId: string, opportunityId: string, message?: string) {
  try {
    const interestData: Partial<Interest> = {
      userId,
      opportunityId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (message !== undefined && message.trim() !== '') {
      interestData.message = message.trim();
    }

    await addDoc(collection(db, 'interests'), interestData);

    return { success: true };
  } catch (error: any) {
    console.error('[INTEREST] Failed to create:', error);
    return { success: false, error: error.message };
  }
},
  // Remove interest
  async removeInterest(userId: string, opportunityId: string) {
    try {
      const q = query(
        collection(db, 'interests'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const interestDoc = querySnapshot.docs.find(
        doc => doc.data().opportunityId === opportunityId
      );
      
      if (interestDoc) {
        await deleteDoc(doc(db, 'interests', interestDoc.id));
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Check if user has shown interest
  async hasInterest(userId: string, opportunityId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'interests'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.some(doc => doc.data().opportunityId === opportunityId);
    } catch (error) {
      console.error('Error checking interest status:', error);
      return false;
    }
  },

  // Get all interests for a user
  async getUserInterests(userId: string): Promise<Interest[]> {
    try {
      const q = query(
        collection(db, 'interests'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      return sortByCreatedAtDesc(
        querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interest))
      );
    } catch (error) {
      console.error('Error fetching user interests:', error);
      return [];
    }
  },

  // Get all interests for an opportunity
  async getOpportunityInterests(opportunityId: string): Promise<Interest[]> {
    try {
      const q = query(
        collection(db, 'interests'),
        where('opportunityId', '==', opportunityId)
      );

      const querySnapshot = await getDocs(q);
      return sortByCreatedAtDesc(
        querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interest))
      );
    } catch (error) {
      console.error('Error fetching opportunity interests:', error);
      return [];
    }
  },

  // Get interest count for an opportunity
  async getInterestCount(opportunityId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'interests'),
        where('opportunityId', '==', opportunityId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error fetching interest count:', error);
      return 0;
    }
  },

// Get all interests (for admin)
async getAllInterests(): Promise<Interest[]> {
  try {
    const q = query(
      collection(db, 'interests')
    );

    const querySnapshot = await getDocs(q);

    return sortByCreatedAtDesc(
      querySnapshot.docs.map(
        doc => ({
          id: doc.id,
          ...doc.data(),
        } as Interest)
      )
    );
  } catch (error) {
    console.error('Error fetching all interests:', error);
    return [];
  }
},

  // Update interest status (for opportunity poster)
  async updateInterestStatus(interestId: string, status: 'accepted' | 'rejected') {
    try {
      await setDoc(doc(db, 'interests', interestId), {
        status,
        updatedAt: new Date(),
      }, { merge: true });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
