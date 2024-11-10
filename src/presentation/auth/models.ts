export interface AuthViewModel {
  email: string;
  password: string;
  displayName?: string;
  loading: boolean;
  error: string | null;
  showPassword: boolean;
}

export interface AuthPresenterActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setDisplayName: (name: string) => void;
  togglePasswordVisibility: () => void;
  login: () => Promise<void>;
  register: () => Promise<void>;
  logout: () => Promise<void>;
} 