export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  is_auth_error?: boolean;
  isAuthError?: boolean;
  pagination?: any;
}

export type ServerResponse<T = any> = ApiResponse<T>;
