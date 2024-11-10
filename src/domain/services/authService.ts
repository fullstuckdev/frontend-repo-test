import type { User as FirebaseUser, UserCredential } from 'firebase/auth';

export interface AuthService {
  signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential>;
  signUpWithEmailAndPassword(email: string, password: string, displayName: string): Promise<UserCredential>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<FirebaseUser | null>;
  getIdToken(): Promise<string | null>;
  updateProfile(displayName: string, photoURL?: string): Promise<void>;
} 