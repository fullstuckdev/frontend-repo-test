import { injectable } from 'inversify';
import { db, auth } from '@/config/firebase';
import { collection, doc, getDocs, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import type { UserRepository } from '@/domain/repositories/userRepository';
import type { UserData } from '@/types';
import type { UpdateUserData } from '@/domain/usecases/user/updateUser';
import { cacheService } from '@/core/cache';
import { logger } from '@/core/logger';

@injectable()
export class FirebaseUserRepository implements UserRepository {
  private readonly collectionName = 'users';
  private readonly cache = cacheService;
  private readonly usersCacheKey = 'users';
  private readonly userCacheKeyPrefix = 'user:';

  async getUsers(): Promise<UserData[]> {
    const cachedUsers = this.cache.get<UserData[]>(this.usersCacheKey);
    if (cachedUsers) return cachedUsers;

    const querySnapshot = await getDocs(collection(db, this.collectionName));
    const users = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as UserData;
    });

    this.cache.set(this.usersCacheKey, users);
    return users;
  }

  async getUserById(userId: string): Promise<UserData> {
    try {
      const cacheKey = `${this.userCacheKeyPrefix}${userId}`;
      const cachedUser = this.cache.get<UserData>(cacheKey);
      if (cachedUser) return cachedUser;

      const userDoc = await getDoc(doc(db, this.collectionName, userId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const data = userDoc.data();
      const user = {
        id: userId,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as UserData;

      this.cache.set(cacheKey, user);
      return user;
    } catch (error) {
      logger.error('Failed to get user by ID', { userId, error });
      throw error;
    }
  }

  async updateUser(userId: string, userData: UpdateUserData): Promise<UserData> {
    const userRef = doc(db, this.collectionName, userId);
    const updatedData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(userRef, updatedData);
    
    this.cache.delete(this.usersCacheKey);
    this.cache.delete(`${this.userCacheKeyPrefix}${userId}`);
    
    const updatedDoc = await getDoc(userRef);
    const data = updatedDoc.data();
    
    const user = {
      id: userId,
      ...data,
      ...updatedData,
      createdAt: data?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserData;

    this.cache.set(`${this.userCacheKeyPrefix}${userId}`, user);
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, userId));
    
    // Invalidate caches
    this.cache.delete(this.usersCacheKey);
    this.cache.delete(`${this.userCacheKeyPrefix}${userId}`);
    
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
    const cacheKey = `${this.usersCacheKey}:exceptCurrent:${currentUser?.uid}`;
    
    const cachedUsers = this.cache.get<UserData[]>(cacheKey);
    if (cachedUsers) return cachedUsers;

    const querySnapshot = await getDocs(collection(db, this.collectionName));
    const users = querySnapshot.docs
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

    this.cache.set(cacheKey, users);
    return users;
  }
} 