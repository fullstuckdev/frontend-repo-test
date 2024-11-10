export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: string;
  isActive: boolean;
  token: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface UserData extends User {
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
} 