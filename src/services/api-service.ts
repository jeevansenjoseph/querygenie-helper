
import { API_BASE_URL, REQUEST_TIMEOUT } from './api-config';

interface ApiOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  withAuth?: boolean;
}

class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiService = {
  /**
   * Makes an API request
   */
  async request<T = any>({
    endpoint,
    method = 'GET',
    body,
    headers = {},
    withAuth = true,
  }: ApiOptions): Promise<T> {
    // Get auth token from localStorage if withAuth is true
    const token = withAuth ? localStorage.getItem('authToken') : null;
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...headers,
      },
      // Add body if method is not GET
      ...(method !== 'GET' && body ? { body: JSON.stringify(body) } : {}),
    };

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      // Make the request
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...requestOptions,
        signal: controller.signal,
      });
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Parse response
      const data = await response.json();
      
      // Check if response is ok
      if (!response.ok) {
        throw new ApiError(
          data.message || 'Something went wrong',
          response.status,
          data
        );
      }
      
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, { message: 'Request took too long to complete' });
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        { message: 'An unexpected error occurred' }
      );
    }
  },
  
  /**
   * Shorthand for GET requests
   */
  get<T = any>(endpoint: string, options: Omit<ApiOptions, 'endpoint' | 'method'> = {}): Promise<T> {
    return this.request<T>({ ...options, endpoint, method: 'GET' });
  },
  
  /**
   * Shorthand for POST requests
   */
  post<T = any>(endpoint: string, body: any, options: Omit<ApiOptions, 'endpoint' | 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>({ ...options, endpoint, method: 'POST', body });
  },
  
  /**
   * Shorthand for PUT requests
   */
  put<T = any>(endpoint: string, body: any, options: Omit<ApiOptions, 'endpoint' | 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>({ ...options, endpoint, method: 'PUT', body });
  },
  
  /**
   * Shorthand for DELETE requests
   */
  delete<T = any>(endpoint: string, options: Omit<ApiOptions, 'endpoint' | 'method'> = {}): Promise<T> {
    return this.request<T>({ ...options, endpoint, method: 'DELETE' });
  },
};
