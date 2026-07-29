import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User as UserType, UserRole } from '@/types';

export const authService = {
  // Register new user
  async register(email: string, password: string, name: string, role: UserRole = 'registered') {
    try {
      console.log('[AUTH] Registration started for:', email);
      console.log('[AUTH] Firebase auth instance:', auth);
      console.log('[AUTH] Firestore db instance:', db);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('[AUTH] Authentication successful. User UID:', user.uid);
      console.log('[AUTH] User email:', user.email);

      // Update display name
      await updateProfile(user, { displayName: name });
      console.log('[AUTH] Display name updated to:', name);

      // Create user document in Firestore
      console.log('[AUTH] Starting Firestore write to users collection...');
      console.log('[AUTH] Document path:', `users/${user.uid}`);
      console.log('[AUTH] Data to write:', {
        id: user.uid,
        name: name,
        email: user.email,
        role: role,
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          id: user.uid,
          name: name,
          email: user.email,
          role: role,
          isVerified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      );

      console.log('[AUTH] Firestore write successful. Users collection created.');
      console.log('[AUTH] Registration completed successfully.');

      return { success: true, user };
    } catch (error: any) {
      console.error('[AUTH] Registration failed:', error);
      console.error('[AUTH] Error code:', error.code);
      console.error('[AUTH] Error message:', error.message);
      console.error('[AUTH] Full error object:', error);
      return { success: false, error: error.message };
    }
  },

  // Login user
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Login with Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        // Create new user document
        const userData: Partial<UserType> = {
          id: user.uid,
          email: user.email!,
          name: user.displayName || '',
          role: 'registered',
          profileImage: user.photoURL || undefined,
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), userData);
      }

      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Auth state listener
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Get user data from Firestore
  async getUserData(userId: string): Promise<UserType | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserType;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },

  // Update user profile
  async updateProfile(userId: string, data: Partial<UserType>) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: new Date(),
      }, { merge: true });

      // Update auth profile if name is provided
      if (data.name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
