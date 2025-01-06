import { AuthResponse, LoginCredentials } from '@/types/auth.types';
import { httpClient } from '@/services/http';
import { API_ENDPOINTS } from './endpoints';

export class AuthService {

  public static async login(credentials: Partial<LoginCredentials>): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  }

  public static async logout(): Promise<void> {
    await httpClient.post(API_ENDPOINTS.LOGOUT);
  }
}