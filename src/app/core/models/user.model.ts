export type UserRole = 'CUSTOMER' | 'AGENT' | 'CLAIMS_OFFICER' | 'ADMIN';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: UserRole[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType?: string;
  expiresIn?: number;
  user: AuthUser;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone?: string;
}
