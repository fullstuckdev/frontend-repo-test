import { Container, interfaces } from 'inversify';
import { LoginUseCase } from '@/domain/usecases/auth/login';
import { RegisterUseCase } from '@/domain/usecases/auth/register';
import { firebaseAuthService } from '@/data/firebase/services/firebaseAuthService';
import type { AuthService } from '@/domain/services/authService';
import { TYPES } from '../types';
import { UserRepository } from '@/domain/repositories/userRepository';

export const registerAuthModule = (container: Container): void => {
  container.bind<AuthService>(TYPES.AuthService)
    .toConstantValue(firebaseAuthService);
    
  container.bind<LoginUseCase>(TYPES.LoginUseCase)
    .toDynamicValue((context: interfaces.Context) => {
      const authService = context.container.get<AuthService>(TYPES.AuthService);
      const userRepository = context.container.get<UserRepository>(TYPES.UserRepository);
      return new LoginUseCase(authService, userRepository);
    });

  container.bind<RegisterUseCase>(TYPES.RegisterUseCase)
    .toDynamicValue((context: interfaces.Context) => {
      const authService = context.container.get<AuthService>(TYPES.AuthService);
      const userRepository = context.container.get<UserRepository>(TYPES.UserRepository);
      return new RegisterUseCase(authService, userRepository);
    });
}
