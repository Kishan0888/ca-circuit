import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Query,
  QueryDocumentSnapshot,
  DocumentData,
  addDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sortByCreatedAtDesc, sortByFieldAsc, sortByFieldDesc } from '@/lib/firestore-utils';
import { Opportunity, OpportunityStatus, CreateOpportunityForm, FilterOptions, SearchQuery } from '@/types';

export const opportunityService = {
  // Create new opportunity
  async createOpportunity(data: CreateOpportunityForm, userId: string, userName: string, userImage?: string) {
    try {
      const opportunityData: Partial<Opportunity> = {
        title: data.title,
        slug: this.generateSlug(data.title),
        category: data.category,
        categoryId: data.category,
        industry: data.industry,
        businessType: data.businessType,
        investmentRange: data.investmentRange,
        investmentMin: data.investmentMin,
        investmentMax: data.investmentMax,
        city: data.city,
        state: data.state,
        location: `${data.city}, ${data.state}`,
        shortDescription: data.shortDescription,
        description: data.description,
        requirements: data.requirements,
        images: [], // Will be updated after image upload
        documents: [], // Will be updated after document upload
        contactPreference: data.contactPreference,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        postedBy: userId,
        postedByName: userName,
        postedByImage: userImage,
        status: 'pending',
        isFeatured: false,
        isUrgent: false,
        viewCount: 0,
        interestedCount: 0,
        bookmarkCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'opportunities'), opportunityData);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Update opportunity
  async updateOpportunity(id: string, data: Partial<Opportunity>) {
    try {
      await updateDoc(doc(db, 'opportunities', id), {
        ...data,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Delete opportunity
  async deleteOpportunity(id: string) {
    try {
      await deleteDoc(doc(db, 'opportunities', id));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get opportunity by ID
  async getOpportunityById(id: string): Promise<Opportunity | null> {
    try {
      const docSnap = await getDoc(doc(db, 'opportunities', id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Opportunity;
      }
      return null;
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      return null;
    }
  },

  // Get opportunity by slug
  async getOpportunityBySlug(slug: string): Promise<Opportunity | null> {
    try {
      const q = query(collection(db, 'opportunities'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const first = querySnapshot.docs[0];
        return { id: first.id, ...first.data() } as Opportunity;
      }
      return null;
    } catch (error) {
      console.error('Error fetching opportunity by slug:', error);
      return null;
    }
  },

  // Get published opportunities with pagination
  async getPublishedOpportunities(
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    limitCount: number = 12
  ): Promise<{ opportunities: Opportunity[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      let q: Query<DocumentData> = query(
        collection(db, 'opportunities'),
        where('status', '==', 'published')
      );

      const querySnapshot = await getDocs(q);
      const sorted = sortByCreatedAtDesc(
        querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Opportunity))
      );
      const opportunities = sorted.slice(0, limitCount);
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { opportunities, lastDoc: newLastDoc };
    } catch (error) {
      console.error('Error fetching published opportunities:', error);
      return { opportunities: [], lastDoc: null };
    }
  },

  // Get featured opportunities
  async getFeaturedOpportunities(limitCount: number = 6): Promise<Opportunity[]> {
    try {
      const q = query(
        collection(db, 'opportunities'),
        where('status', '==', 'published')
      );

      const querySnapshot = await getDocs(q);
      return sortByCreatedAtDesc(
        querySnapshot.docs
          .map(d => ({ id: d.id, ...d.data() } as Opportunity))
          .filter(opp => opp.isFeatured)
      ).slice(0, limitCount);
    } catch (error) {
      console.error('Error fetching featured opportunities:', error);
      return [];
    }
  },

  // Get opportunities by user
  async getOpportunitiesByUser(userId: string): Promise<Opportunity[]> {
    try {
      const q = query(
        collection(db, 'opportunities'),
        where('postedBy', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      return sortByCreatedAtDesc(
        querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Opportunity))
      );
    } catch (error) {
      console.error('Error fetching user opportunities:', error);
      return [];
    }
  },

  // Get ALL opportunities regardless of status (for admin management)
  async getAllOpportunities(): Promise<Opportunity[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'opportunities'));
      return sortByCreatedAtDesc(
        querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Opportunity))
      );
    } catch (error) {
      console.error('Error fetching all opportunities:', error);
      return [];
    }
  },

  // Get opportunities by status (for admin)
  async getOpportunitiesByStatus(status: OpportunityStatus): Promise<Opportunity[]> {
    try {
      const q = query(
        collection(db, 'opportunities'),
        where('status', '==', status)
      );

      const querySnapshot = await getDocs(q);
      return sortByCreatedAtDesc(
        querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Opportunity))
      );
    } catch (error) {
      console.error('Error fetching opportunities by status:', error);
      return [];
    }
  },

  // Search opportunities
  async searchOpportunities(searchQuery: SearchQuery): Promise<Opportunity[]> {
    try {
      let q: Query<DocumentData> = query(
        collection(db, 'opportunities'),
        where('status', '==', 'published')
      );

      const querySnapshot = await getDocs(q);
      let opportunities = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Opportunity));

      // Apply filters client-side to avoid composite index requirements
      if (searchQuery.filters.category) {
        opportunities = opportunities.filter(opp => opp.category === searchQuery.filters.category);
      }
      if (searchQuery.filters.industry) {
        opportunities = opportunities.filter(opp => opp.industry === searchQuery.filters.industry);
      }
      if (searchQuery.filters.investmentRange) {
        opportunities = opportunities.filter(opp => opp.investmentRange === searchQuery.filters.investmentRange);
      }
      if (searchQuery.filters.location) {
        opportunities = opportunities.filter(opp => opp.location === searchQuery.filters.location);
      }
      if (searchQuery.filters.businessType) {
        opportunities = opportunities.filter(opp => opp.businessType === searchQuery.filters.businessType);
      }

      // Apply sorting client-side
      switch (searchQuery.sortBy) {
        case 'latest':
          opportunities = sortByCreatedAtDesc(opportunities);
          break;
        case 'popular':
          opportunities = sortByFieldDesc(opportunities, opp => opp.viewCount ?? 0);
          break;
        case 'investment_high':
          opportunities = sortByFieldDesc(opportunities, opp => opp.investmentMax ?? 0);
          break;
        case 'investment_low':
          opportunities = sortByFieldAsc(opportunities, opp => opp.investmentMin ?? 0);
          break;
        default:
          opportunities = sortByCreatedAtDesc(opportunities);
      }

      // Apply text search (client-side filtering)
      if (searchQuery.query) {
        const searchTerm = searchQuery.query.toLowerCase();
        opportunities = opportunities.filter(
          opp =>
            opp.title.toLowerCase().includes(searchTerm) ||
            opp.description.toLowerCase().includes(searchTerm) ||
            opp.industry.toLowerCase().includes(searchTerm) ||
            opp.city.toLowerCase().includes(searchTerm)
        );
      }

      return opportunities;
    } catch (error) {
      console.error('Error searching opportunities:', error);
      return [];
    }
  },

  // Increment view count
  async incrementViewCount(id: string) {
    try {
      await updateDoc(doc(db, 'opportunities', id), {
        viewCount: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  },

  // Increment interested count
  async incrementInterestedCount(id: string) {
    try {
      await updateDoc(doc(db, 'opportunities', id), {
        interestedCount: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing interested count:', error);
    }
  },

  // Decrement interested count
  async decrementInterestedCount(id: string) {
    try {
      await updateDoc(doc(db, 'opportunities', id), {
        interestedCount: increment(-1),
      });
    } catch (error) {
      console.error('Error decrementing interested count:', error);
    }
  },

  // Increment bookmark count
  async incrementBookmarkCount(id: string) {
    try {
      await updateDoc(doc(db, 'opportunities', id), {
        bookmarkCount: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing bookmark count:', error);
    }
  },

  // Decrement bookmark count
  async decrementBookmarkCount(id: string) {
    try {
      await updateDoc(doc(db, 'opportunities', id), {
        bookmarkCount: increment(-1),
      });
    } catch (error) {
      console.error('Error decrementing bookmark count:', error);
    }
  },

  // Admin: Approve opportunity
  async approveOpportunity(id: string) {
    try {
      await updateDoc(doc(db, 'opportunities', id), {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Admin: Reject opportunity
  async rejectOpportunity(id: string, reason: string) {
    try {
      await updateDoc(doc(db, 'opportunities', id), {
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Admin: Set as featured
  async setFeatured(id: string, isFeatured: boolean) {
    try {
      await updateDoc(doc(db, 'opportunities', id), {
        isFeatured,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Helper: Generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },
};
