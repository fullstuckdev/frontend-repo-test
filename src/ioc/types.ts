export const TYPES = {
  // Services
  AuthService: Symbol.for('AuthService'),
  FirebaseAuthService: Symbol.for('FirebaseAuthService'),
  
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  
  // Use Cases
  LoginUseCase: Symbol.for('LoginUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),
  
  // Presenters
  AuthPresenter: Symbol.for('AuthPresenter'),
  DashboardPresenter: Symbol.for('DashboardPresenter'),
  
  // ViewModels
  DashboardViewModel: Symbol.for('DashboardViewModel'),
} as const; 