export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}


  export interface LoginResponse {
    token: string;
    accountId: string;
  }
  
  export interface UserProfile {
    id: string;
    email: string;
    role: 'user' | 'admin';
    name: string;
  }