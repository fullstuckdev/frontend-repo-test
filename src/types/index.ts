export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  isActive: boolean;
  token?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
} 