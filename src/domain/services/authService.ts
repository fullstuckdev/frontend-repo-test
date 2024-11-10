import type { UserCredential } from 'firebase/auth';

export interface AuthService {
  signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential>;
  signUpWithEmailAndPassword(email: string, password: string, displayName: string): Promise<UserCredential>;
  signOut(): Promise<void>;
  getCurrentUser(): any;
} 