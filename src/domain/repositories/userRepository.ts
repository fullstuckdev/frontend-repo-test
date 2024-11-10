import type { UserData } from '@/types';
import type { UpdateUserData } from '@/domain/usecases/user/updateUser';

export interface UserRepository {
  getUsers(): Promise<UserData[]>;
  getUsersExceptCurrent(): Promise<UserData[]>;
  getUserById(userId: string): Promise<UserData>;
  updateUser(userId: string, userData: UpdateUserData): Promise<UserData>;
  deleteUser(userId: string): Promise<void>;
  createUser(userId: string, userData: Partial<UserData>): Promise<UserData>;
}
