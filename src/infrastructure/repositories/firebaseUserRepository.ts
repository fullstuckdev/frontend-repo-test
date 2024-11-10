import { injectable } from 'inversify';
import { db, auth } from '@/config/firebase';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import type { UserRepository } from '@/domain/repositories/userRepository';
import type { UserData } from '@/types';
import type { UpdateUserData } from '@/domain/usecases/user/updateUser';
import { logger } from '@/core/logger';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message: string;
}

@injectable()
export class FirebaseUserRepository implements UserRepository {
  private readonly collectionName = 'users';
  private readonly apiBaseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/us-central1/api/v1/users`;

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await auth.currentUser?.getIdToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getUsers(): Promise<UserData[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.apiBaseUrl}/fetch-users-data`, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const result = await response.json() as ApiResponse<UserData[]>;
      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    } catch (error) {
      logger.error('Failed to fetch users from API', { error });
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserData> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.apiBaseUrl}/fetch-users-data`, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const result = await response.json() as ApiResponse<UserData[]>;
      if (!result.success) {
        throw new Error(result.message);
      }

      const user = result.data.find((u: UserData) => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      logger.error('Failed to get user by ID', { userId, error });
      throw error;
    }
  }

  async getUsersExceptCurrent(): Promise<UserData[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.apiBaseUrl}/fetch-users-data`, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const result = await response.json() as ApiResponse<UserData[]>;
      if (!result.success) {
        throw new Error(result.message);
      }

      const currentUser = auth.currentUser;
      return result.data.filter((user: UserData) => user.id !== currentUser?.uid);
    } catch (error) {
      logger.error('Failed to fetch users from API', { error });
      throw error;
    }
  }

  async updateUser(userId: string, userData: UpdateUserData): Promise<UserData> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.apiBaseUrl}/update-user-data/${userId}`, {
        method: 'PUT',
        headers,
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

      return await response.json();
    } catch (error) {
      logger.error('Failed to update user via API', { userId, userData, error });
      throw error;
    }
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
} 