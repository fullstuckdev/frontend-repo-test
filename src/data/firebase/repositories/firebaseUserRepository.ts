import { injectable } from 'inversify';
import { db, auth } from '@/config/firebase';
import { doc, getDoc, deleteDoc, setDoc, getDocs } from 'firebase/firestore';
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
  private readonly apiBaseUrl = 'http://127.0.0.1:5001/test-fullstack-1c6a8/us-central1/api/v1/users';

  async getUsers(): Promise<UserData[]> {
    const cachedUsers = this.cache.get<UserData[]>(this.usersCacheKey);
    if (cachedUsers) return cachedUsers;

    try {
      const response = await fetch(`${this.apiBaseUrl}/fetch-users-data`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const users = await response.json();
      this.cache.set(this.usersCacheKey, users);
      return users;
    } catch (error) {
      logger.error('Failed to fetch users from API', { error });
      throw error;
    }
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
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/update-user-data/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          role: userData.role,
          isActive: userData.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const updatedUser = await response.json();
      
      // Invalidate caches
      this.cache.delete(this.usersCacheKey);
      this.cache.delete(`${this.userCacheKeyPrefix}${userId}`);
      
      // Cache the updated user
      this.cache.set(`${this.userCacheKeyPrefix}${userId}`, updatedUser);
      
      return updatedUser;
    } catch (error) {
      logger.error('Failed to update user via API', { userId, userData, error });
      throw error;
    }
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

    try {
      const response = await fetch(`${this.apiBaseUrl}/fetch-users-data`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const allUsers = await response.json();
      const users = allUsers.filter((user: UserData) => user.id !== currentUser?.uid);

      this.cache.set(cacheKey, users);
      return users;
    } catch (error) {
      logger.error('Failed to fetch users from API', { error });
      throw error;
    }
  }
} 