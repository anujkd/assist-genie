import { httpClient } from '@/services/http';

export interface User {
  id: number;
  email: string;
  name: string;
}

export class UserService {
  private static readonly BASE_PATH = '/users';

  public static async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<User>(`${this.BASE_PATH}/me`);
    return response.data;
  }

  public static async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const response = await httpClient.put<User>(`${this.BASE_PATH}/${userId}`, userData);
    return response.data;
  }
}