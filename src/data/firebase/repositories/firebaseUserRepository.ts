import { injectable } from 'inversify';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { UserRepository } from '@/domain/repositories/userRepository';
import type { User } from '@/types';

@injectable()
export class FirebaseUserRepository implements UserRepository {
  private readonly collectionName = 'users';

  async getUserById(id: string): Promise<User> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('User not found');
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as User;
  }

  async createUser(id: string, userData: Partial<User>): Promise<User> {
    const docRef = doc(db, this.collectionName, id);
    const newUser = {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(docRef, newUser);
    
    return {
      id,
      ...newUser,
    } as User;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const docRef = doc(db, this.collectionName, id);
    const updateData = {
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    
    await updateDoc(docRef, updateData);
    
    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async getAllUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as User));
  }
} 