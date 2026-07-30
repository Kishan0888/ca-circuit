import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit as fbLimit,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sortByCreatedAtDesc } from '@/lib/firestore-utils';
import { User, UserRole, AuditLog, AuditAction, AdminOverviewStats } from '@/types';

export const adminService = {
  // Get all users (for the users management table)
  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return sortByCreatedAtDesc(
        querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as User))
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Update a user's role
  async updateUserRole(userId: string, role: UserRole) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Suspend / reactivate a user
  async setUserSuspended(userId: string, isSuspended: boolean) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isSuspended,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Manually verify a user
  async setUserVerified(userId: string, isVerified: boolean) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isVerified,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Write an audit log entry. Never throws — logging failures shouldn't block admin actions.
  async logAction(entry: {
    action: AuditAction;
    targetType: 'opportunity' | 'user';
    targetId: string;
    targetLabel: string;
    adminId: string;
    adminName: string;
    details?: string;
  }) {
    try {
      await addDoc(collection(db, 'auditLogs'), {
        ...entry,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error writing audit log:', error);
    }
  },

  // Get recent audit log entries
  async getRecentAuditLogs(count: number = 20): Promise<AuditLog[]> {
    try {
      const q = query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc'), fbLimit(count));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  },
};

// Re-exported here so dashboard/analytics pages have a single stats shape to build from.
export type { AdminOverviewStats };
