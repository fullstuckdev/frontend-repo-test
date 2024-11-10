import type { User } from '@/types';

export interface UserRepository {
  getUserById(id: string): Promise<User>;
  createUser(id: string, userData: Partial<User>): Promise<User>;
  updateUser(id: string, userData: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
}
