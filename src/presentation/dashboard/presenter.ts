import { UserRepository } from '@/domain/repositories/userRepository';
import { DashboardPresenterState, DashboardViewModel } from './models';
import { setUser } from '@/dataStore/auth/slice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { auth } from '@/data/firebase';
import { User } from '@/domain/models/user';

export class DashboardPresenter {
  constructor(
    private userRepository: UserRepository,
    private dispatch: ReturnType<typeof useDispatch>,
    private router: ReturnType<typeof useRouter>,
    private state: DashboardPresenterState
  ) {}

  private updateViewModel(updates: Partial<DashboardViewModel>) {
    this.state.setViewModel({
      ...this.state.viewModel,
      ...updates
    });
  }

  private showSnackbar(message: string, severity: DashboardViewModel['snackbar']['severity']) {
    this.updateViewModel({
      snackbar: {
        open: true,
        message,
        severity
      }
    });
  }

  async fetchUsers(): Promise<void> {
    this.updateViewModel({ loading: true });
    try {
      const users = await this.userRepository.fetchUsers();
      this.updateViewModel({ users });
      this.showSnackbar('Users loaded successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      this.updateViewModel({ error: errorMessage });
      this.showSnackbar('Failed to load users', 'error');
    } finally {
      this.updateViewModel({ loading: false });
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const updatedUser = await this.userRepository.updateUser(userId, userData);
      this.updateViewModel({
        users: this.state.viewModel.users.map(user => 
          user.id === userId ? updatedUser : user
        )
      });
      this.showSnackbar('User updated successfully', 'success');
    } catch (error) {
      this.updateViewModel({
        error: error instanceof Error ? error.message : 'Failed to update user'
      });
      this.showSnackbar('Failed to update user', 'error');
    }
  }

  async restoreSession(): Promise<void> {
    try {
      await new Promise<void>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          unsubscribe();
          if (user) {
            const userData = await this.userRepository.fetchUser(user.uid);
            const token = await user.getIdToken(true);
            this.dispatch(setUser({ ...userData, token }));
            localStorage.setItem('token', token);
          }
          resolve();
        });
      });
    } catch (error) {
      this.updateViewModel({
        error: error instanceof Error ? error.message : 'Session restoration failed'
      });
      this.router.push('/');
    }
  }

  async logout(): Promise<void> {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      this.dispatch(setUser(null));
      this.router.push('/');
    } catch (error) {
      this.updateViewModel({
        error: error instanceof Error ? error.message : 'Logout failed'
      });
      this.showSnackbar('Logout failed', 'error');
    }
  }
} 