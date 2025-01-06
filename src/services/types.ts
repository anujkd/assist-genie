export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}
