export const TYPES = {
  // Services
  AuthService: Symbol.for('AuthService'),
  FirebaseAuthService: Symbol.for('FirebaseAuthService'),
  
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  
  // Use Cases
  LoginUseCase: Symbol.for('LoginUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  
  // Presenters
  AuthPresenter: Symbol.for('AuthPresenter'),
  DashboardPresenter: Symbol.for('DashboardPresenter'),
} as const; 