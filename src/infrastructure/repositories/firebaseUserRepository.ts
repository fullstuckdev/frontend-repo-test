import { injectable } from 'inversify';
import { db, auth } from '@/config/firebase';
import { collection, doc, getDocs, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import type { UserRepository } from '@/domain/repositories/userRepository';
import type { UserData } from '@/types';
import type { UpdateUserData } from '@/domain/usecases/user/updateUser';

@injectable()
export class FirebaseUserRepository implements UserRepository {
  private readonly collectionName = 'users';

  async getUsers(): Promise<UserData[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as UserData;
    });
  }

  async getUserById(userId: string): Promise<UserData> {
    const userDoc = await getDoc(doc(db, this.collectionName, userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const data = userDoc.data();
    return {
      id: userId,
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    } as UserData;
  }

  async updateUser(userId: string, userData: UpdateUserData): Promise<UserData> {
    const userRef = doc(db, this.collectionName, userId);
    const updatedData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(userRef, updatedData);
    
    const updatedDoc = await getDoc(userRef);
    const data = updatedDoc.data();
    
    return {
      id: userId,
      ...data,
      ...updatedData,
      createdAt: data?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserData;
  }

  async deleteUser(userId: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, userId));
    
    const currentAuthUser = auth.currentUser;
    if (currentAuthUser && currentAuthUser.uid === userId) {
      await deleteUser(currentAuthUser);
    }
  }

  async createUser(userId: string, userData: Partial<UserData>): Promise<UserData> {
    const userRef = doc(db, this.collectionName, userId);
    const timestamp = new Date().toISOString();
    
    const newUserData = {
      ...userData,
      createdAt: timestamp,
      updatedAt: timestamp,
      isActive: userData.isActive ?? true,
      role: userData.role || 'user',
    };

    await setDoc(userRef, newUserData);

    return {
      id: userId,
      ...newUserData,
    } as UserData;
  }

  async getUsersExceptCurrent(): Promise<UserData[]> {
    const currentUser = auth.currentUser;
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    
    return querySnapshot.docs
      .filter(doc => doc.id !== currentUser?.uid)
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        } as UserData;
      });
  }
} 