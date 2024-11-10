import { injectable, inject } from 'inversify';
import type { UserRepository } from '@/domain/repositories/userRepository';
import { TYPES } from '@/ioc/types';

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }
} 