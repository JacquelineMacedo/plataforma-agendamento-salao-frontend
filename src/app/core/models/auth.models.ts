export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CUSTOMER' | 'PROFESSIONAL';
  timezone: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
}

export interface CurrentUser {
  accessToken: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
}
