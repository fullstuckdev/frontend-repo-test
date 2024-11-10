export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  token: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
} 