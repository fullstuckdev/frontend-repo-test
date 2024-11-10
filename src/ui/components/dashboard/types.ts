import type { User as DomainUser } from '@/domain/models/user';

// Create a more flexible User type for UI components
export interface UIUser extends Omit<DomainUser, 'photoURL'> {
  photoURL?: string;
}

export interface UserData extends UIUser {
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
  user: UIUser;
  onUpdateUser: (userData: Partial<UIUser>) => Promise<void>;
}

export interface StatusBadgeProps {
  isActive: boolean;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export interface DeleteConfirmDialogProps {
  open: boolean;
  user: UserData | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: (user: UserData) => Promise<void>;
} 