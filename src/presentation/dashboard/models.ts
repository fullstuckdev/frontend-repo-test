import { User } from '@/domain/models/user';

export interface DashboardViewModel {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  };
  dialogs: {
    edit: boolean;
    delete: boolean;
  };
}

export interface DashboardPresenterState {
  viewModel: DashboardViewModel;
  setViewModel: (viewModel: DashboardViewModel) => void;
}

export interface DashboardPresenterActions {
  fetchUsers: () => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
} 