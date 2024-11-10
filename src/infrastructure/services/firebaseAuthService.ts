import { injectable } from 'inversify';
import { 
  getAuth, 
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  signOut as firebaseSignOut,
  type User,
  type UserCredential
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import type { AuthService } from '@/domain/services/authService';
import { logger } from '@/core/logger';

@injectable()
export class FirebaseAuthService implements AuthService {
  async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    try {
      return await firebaseSignIn(auth, email, password);
    } catch (error) {
      logger.error('Failed to sign in user', { email, error });
      throw error;
    }
  }

  async signUpWithEmailAndPassword(email: string, password: string, displayName: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await this.updateProfile(displayName);
      return userCredential;
    } catch (error) {
      logger.error('Failed to sign up user', { email, displayName, error });
      throw error;
    }
  }

  async signOut(): Promise<void> {
    return firebaseSignOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    return auth.currentUser;
  }

  async getIdToken(): Promise<string | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;
    return user.getIdToken();
  }

  async updateProfile(displayName: string, photoURL?: string): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('No user is signed in');
      await firebaseUpdateProfile(user, { displayName, photoURL });
    } catch (error) {
      logger.error('Failed to update user profile', { displayName, photoURL, error });
      throw error;
    }
  }
} 