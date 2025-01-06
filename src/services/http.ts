import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, ApiError, RequestConfig } from '@/services/types';
import { API_CONFIG } from '@/config/env';

class HttpClient {
  private static instance: HttpClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      config => {
        // Get token from localStorage or your auth state management
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'An unexpected error occurred',
          status: error.response?.status || 500,
        };

        if (error.response?.status === 401) {
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }

        return Promise.reject(apiError);
      }
    );
  }

  public async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, config);
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
  }

  public async post<T>(url: string, data?: Record<string, unknown>, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
  }

  public async put<T>(url: string, data: Record<string, unknown>, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
  }

  public async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
  }
}

export const httpClient = HttpClient.getInstance();
