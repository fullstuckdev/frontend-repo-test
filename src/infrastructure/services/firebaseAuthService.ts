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

@injectable()
export class FirebaseAuthService implements AuthService {
  async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return firebaseSignIn(auth, email, password);
  }

  async signUpWithEmailAndPassword(email: string, password: string, displayName: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await this.updateProfile(displayName);
    return userCredential;
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
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No user is signed in');
    
    await firebaseUpdateProfile(user, { 
      displayName, 
      photoURL: photoURL ?? `https://api.dicebear.com/7.x/avatars/svg?seed=${user.email}` 
    });
  }
} 