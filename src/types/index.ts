export interface User {
  id: string;
  email: string;
  displayName: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
} 