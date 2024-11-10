import { injectable, inject } from 'inversify';
import { TYPES } from '@/ioc/types';
import type { UpdateUserUseCase } from '@/domain/usecases/user/updateUser';
import type { DeleteUserUseCase } from '@/domain/usecases/user/deleteUser';
import type { GetUsersUseCase } from '@/domain/usecases/user/getUsers';
import type { UserData } from '@/types';

@injectable()
export class DashboardViewModel {
  constructor(
    @inject(TYPES.UpdateUserUseCase) private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(TYPES.DeleteUserUseCase) private readonly deleteUserUseCase: DeleteUserUseCase,
    @inject(TYPES.GetUsersUseCase) private readonly getUsersUseCase: GetUsersUseCase
  ) {}

  async getUsers(): Promise<UserData[]> {
    return await this.getUsersUseCase.execute();
  }

  async updateUser(userId: string, userData: Partial<UserData>): Promise<UserData> {
    return await this.updateUserUseCase.execute(userId, userData);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.deleteUserUseCase.execute(userId);
  }
} 