import { injectable, inject } from 'inversify';
import type { UserRepository } from '@/domain/repositories/userRepository';
import type { User } from '@/types';
import { TYPES } from '@/ioc/types';

export interface UpdateUserData {
  displayName?: string;
  photoURL?: string;
  role?: string;
  isActive?: boolean;
}

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string, userData: UpdateUserData): Promise<User> {
    return await this.userRepository.updateUser(userId, userData);
  }
} 