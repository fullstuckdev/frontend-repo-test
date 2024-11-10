import { injectable, inject } from 'inversify';
import type { AuthService } from '@/domain/services/authService';
import type { UserRepository } from '@/domain/repositories/userRepository';
import type { User } from '@/types';
import { TYPES } from '@/ioc/types';

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

@injectable()
export class RegisterUseCase {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: AuthService,
    @inject(TYPES.UserRepository) private readonly userRepository: UserRepository
  ) {}

  async execute(credentials: RegisterCredentials): Promise<User> {
    const userCredential = await this.authService.signUpWithEmailAndPassword(
      credentials.email,
      credentials.password,
      credentials.displayName
    );

    const token = await userCredential.user.getIdToken();
    
    const userData = {
      email: credentials.email,
      displayName: credentials.displayName,
      photoURL: `https://api.dicebear.com/7.x/avatars/svg?seed=${credentials.email}`,
      role: 'user',
      isActive: true,
    };

    const user = await this.userRepository.createUser(userCredential.user.uid, userData);

    return {
      ...user,
      token,
    };
  }
}
