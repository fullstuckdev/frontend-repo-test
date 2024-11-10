import { injectable } from 'inversify';
import { auth } from '@/config/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type UserCredential 
} from 'firebase/auth';
import type { AuthService } from '@/domain/services/authService';

@injectable()
export class FirebaseAuthService implements AuthService {
  async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async signUpWithEmailAndPassword(
    email: string, 
    password: string, 
    displayName: string
  ): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName,
        photoURL: `https://api.dicebear.com/7.x/avatars/svg?seed=${email}`,
      });
    }

    return userCredential;
  }

  async signOut(): Promise<void> {
    await auth.signOut();
  }

  getCurrentUser() {
    return auth.currentUser;
  }
} 