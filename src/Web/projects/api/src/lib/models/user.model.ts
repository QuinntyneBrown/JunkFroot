export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  loyaltyId: string | null;
  createdAt: string;
}

export enum UserRole {
  Customer = 'Customer',
  Operator = 'Operator',
  Admin = 'Admin',
}

export interface CustomerProfile {
  id: string;
  userId: string;
  displayName: string;
  phone: string;
  avatarUrl: string | null;
  birthday: string | null;
  allergies: string[];
  preferences: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: AppUser;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export interface ProfileUpdateRequest {
  displayName: string;
  phone: string;
  birthday: string | null;
  allergies: string[];
  preferences: string[];
}
