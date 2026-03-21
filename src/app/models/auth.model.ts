export type Role = 'ADMINISTRATEUR' | 'CAISSIER' | 'LIVREUR' | 'MAGASIN';

export interface RegisterRequest {
  username: string;
  email: string;
  motDePasse: string;
  fullName: string;
  role: Role;
}

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
  error: string | null;
}
