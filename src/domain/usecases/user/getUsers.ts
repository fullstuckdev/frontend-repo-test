import { injectable, inject } from 'inversify';
import type { UserRepository } from '@/domain/repositories/userRepository';
import type { UserData } from '@/types';
import { TYPES } from '@/ioc/types';

@injectable()
export class GetUsersUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: UserRepository
  ) {}

  async execute(): Promise<UserData[]> {
    return this.userRepository.getUsersExceptCurrent();
  }
} 