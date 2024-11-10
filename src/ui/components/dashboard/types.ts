import type { User } from '@/types';

export interface UserData extends User {
  createdAt: string;
  updatedAt: string;
}

export interface EditDialogProps {
  open: boolean;
  user: UserData | null;
  onClose: () => void;
  onSave: (userData: Partial<UserData>) => Promise<void>;
}

export interface ProfileCardProps {
  user: User;
  onUpdateUser: (userData: Partial<User>) => Promise<void>;
}

export interface StatusBadgeProps {
  isActive: boolean;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
} 