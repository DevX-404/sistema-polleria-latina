export type Role = 'ADMIN' | 'CAJERO' | 'MESERO' | 'COCINA';

export interface UserSession {
  username: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  username: string;
  role: Role;
}

export interface ApiProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export interface AuthContextType {
  token: string | null;
  user: UserSession | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isLocked: boolean;
  login: (username: string, pin: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}
