
import { apiService } from './api-service';
import { ENDPOINTS } from './api-config';
import { toast } from "@/components/ui/sonner";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  /**
   * Log in a user
   */
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await apiService.post<AuthResponse>(
        ENDPOINTS.AUTH.LOGIN,
        credentials,
        { withAuth: false }
      );
      
      // Store token
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await apiService.post<AuthResponse>(
        ENDPOINTS.AUTH.REGISTER,
        userData,
        { withAuth: false }
      );
      
      // Store token
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (if needed)
      await apiService.post(ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },
  
  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Check if user is already in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      
      // If not, fetch from API
      const token = localStorage.getItem('authToken');
      if (!token) {
        return null;
      }
      
      const user = await apiService.get<User>(ENDPOINTS.AUTH.ME);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return null;
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
};
