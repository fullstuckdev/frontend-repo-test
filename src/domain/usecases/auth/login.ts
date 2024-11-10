import { injectable, inject } from 'inversify';
import type { AuthService } from '@/domain/services/authService';
import type { UserRepository } from '@/domain/repositories/userRepository';
import type { User } from '@/types';
import { TYPES } from '@/ioc/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: AuthService,
    @inject(TYPES.UserRepository) private readonly userRepository: UserRepository
  ) {}

  async execute(credentials: LoginCredentials): Promise<User> {
    const userCredential = await this.authService.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    
    const token = await userCredential.user.getIdToken();
    const userData = await this.userRepository.getUserById(userCredential.user.uid);
    
    return {
      ...userData,
      token,
    };
  }
}
