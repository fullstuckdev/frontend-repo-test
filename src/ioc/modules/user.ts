import { Container } from 'inversify';
import { UserRepository } from '@/domain/repositories/userRepository';
import { FirebaseUserRepository } from '@/data/firebase/repositories/firebaseUserRepository';
import { TYPES } from '../types';

export const registerUserModule = (container: Container): void => {
  container.bind<UserRepository>(TYPES.UserRepository)
    .to(FirebaseUserRepository)
    .inSingletonScope();
};
