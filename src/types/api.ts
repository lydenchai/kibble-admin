// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ServerResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  isAuthError?: boolean;
  pagination?: any;
}
