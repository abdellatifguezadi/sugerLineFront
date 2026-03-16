export interface LoginRequest {
  username: string;
  motDePasse: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
