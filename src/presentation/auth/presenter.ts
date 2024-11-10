import { LoginUseCase } from '@/domain/usecases/auth/login';
import { RegisterUseCase } from '@/domain/usecases/auth/register';
import { AuthViewModel } from './models';
import { setUser, setLoading, setError } from '@/dataStore/auth/slice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

export class AuthPresenter {
  private viewModel: AuthViewModel = {
    email: '',
    password: '',
    displayName: '',
    loading: false,
    error: null,
    showPassword: false
  };

  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private dispatch: ReturnType<typeof useDispatch>,
    private router: ReturnType<typeof useRouter>
  ) {}

  async login(): Promise<void> {
    this.dispatch(setLoading(true));
    this.dispatch(setError(null));
    
    try {
      const user = await this.loginUseCase.execute({
        email: this.viewModel.email,
        password: this.viewModel.password
      });
      
      this.dispatch(setUser(user));
      localStorage.setItem('token', user.token);
      this.router.push('/dashboard');
    } catch (error) {
      this.dispatch(setError(error instanceof Error ? error.message : 'Login failed'));
    } finally {
      this.dispatch(setLoading(false));
    }
  }

  async register(): Promise<void> {
    if (!this.viewModel.displayName) {
      this.dispatch(setError('Display name is required'));
      return;
    }

    this.dispatch(setLoading(true));
    this.dispatch(setError(null));
    
    try {
      const user = await this.registerUseCase.execute({
        email: this.viewModel.email,
        password: this.viewModel.password,
        displayName: this.viewModel.displayName
      });
      
      this.dispatch(setUser(user));
      localStorage.setItem('token', user.token);
      this.router.push('/dashboard');
    } catch (error) {
      this.dispatch(setError(error instanceof Error ? error.message : 'Registration failed'));
    } finally {
      this.dispatch(setLoading(false));
    }
  }
} 