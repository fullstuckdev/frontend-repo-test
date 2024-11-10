import { injectable } from 'inversify';
import { 
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  type User,
  type UserCredential
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import type { AuthService } from '@/domain/services/authService';
import { logger } from '@/core/logger';

@injectable()
export class FirebaseAuthService implements AuthService {
  private readonly apiBaseUrl = 'http://127.0.0.1:5001/test-fullstack-1c6a8/us-central1/api/v1';

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
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      logger.error('Failed to sign out user', { error });
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/fetch-users-data`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const users = await response.json();
      const currentAuthUser = auth.currentUser;
      
      if (!currentAuthUser) return null;
      
      const currentUser = users.find((user: any) => user.id === currentAuthUser.uid);
      return currentUser || null;
      
    } catch (error) {
      logger.error('Failed to get current user', { error });
      throw error;
    }
  }

  async getIdToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      return user.getIdToken();
    } catch (error) {
      logger.error('Failed to get ID token', { error });
      throw error;
    }
  }

  async updateProfile(displayName: string, photoURL?: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user is signed in');

      // Update Firebase Auth profile
      await firebaseUpdateProfile(user, { displayName, photoURL });

      // Update user data in the API
      const response = await fetch(`${this.apiBaseUrl}/users/update-user-data/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName,
          photoURL,
          role: 'user', // You might want to make this configurable
          isActive: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user profile: ${response.statusText}`);
      }
    } catch (error) {
      logger.error('Failed to update user profile', { displayName, photoURL, error });
      throw error;
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();