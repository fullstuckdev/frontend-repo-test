'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { FirebaseAuthService } from '@/infrastructure/services/firebaseAuthService';
import { FirebaseUserRepository } from '@/infrastructure/repositories/firebaseUserRepository';
import { LoginUseCase } from '@/domain/usecases/auth/login';
import { RegisterUseCase } from '@/domain/usecases/auth/register';
import { UpdateUserUseCase } from '@/domain/usecases/user/updateUser';
import { DeleteUserUseCase } from '@/domain/usecases/user/deleteUser';
import { GetUsersUseCase } from '@/domain/usecases/user/getUsers';
import { DashboardViewModel } from '@/ui/viewmodels/DashboardViewModel';
import type { AuthService } from '@/domain/services/authService';
import type { UserRepository } from '@/domain/repositories/userRepository';

const container = new Container({ defaultScope: "Singleton" });

// Clear any existing bindings
container.unbindAll();

// Services
container
  .bind<AuthService>(TYPES.AuthService)
  .to(FirebaseAuthService)
  .inSingletonScope();

// Repositories
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(FirebaseUserRepository)
  .inSingletonScope();

// Use Cases
container
  .bind(TYPES.LoginUseCase)
  .to(LoginUseCase)
  .inTransientScope();

container
  .bind(TYPES.RegisterUseCase)
  .to(RegisterUseCase)
  .inTransientScope();

container
  .bind(TYPES.UpdateUserUseCase)
  .to(UpdateUserUseCase)
  .inTransientScope();

container
  .bind(TYPES.DeleteUserUseCase)
  .to(DeleteUserUseCase)
  .inTransientScope();

container
  .bind(TYPES.GetUsersUseCase)
  .to(GetUsersUseCase)
  .inTransientScope();

// ViewModels
container
  .bind(TYPES.DashboardViewModel)
  .to(DashboardViewModel)
  .inTransientScope();

export { container };
