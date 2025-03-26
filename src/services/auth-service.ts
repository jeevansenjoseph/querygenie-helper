import { apiService } from './api-service';
import { ENDPOINTS } from './api-config';

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

// Demo user data for offline testing
const DEMO_USER: User = {
  id: 'demo-123',
  email: 'demo@example.com',
  name: 'Demo User'
};

const DEMO_TOKEN = 'demo-jwt-token-12345';

export const authService = {
  /**
   * Log in a user
   */
  async login(credentials: LoginRequest): Promise<User> {
    try {
      // Check if using demo credentials
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        // Handle demo login locally
        localStorage.setItem('authToken', DEMO_TOKEN);
        localStorage.setItem('user', JSON.stringify(DEMO_USER));
        return DEMO_USER;
      }
      
      // Regular API login - without using the withAuth property
      const response = await apiService.post(
        ENDPOINTS.AUTH.LOGIN,
        credentials
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
      // Check if registering with demo email
      if (userData.email === 'demo@example.com') {
        throw new Error('Demo email cannot be used for registration');
      }
      
      const response = await apiService.post(
        ENDPOINTS.AUTH.REGISTER,
        userData
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
      // Don't attempt API call for demo user
      const user = localStorage.getItem('user');
      if (user && JSON.parse(user).email === 'demo@example.com') {
        // Simply clear storage for demo user
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return;
      }
      
      // Regular logout via API
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
      
      // Don't try to fetch from API for demo token
      if (token === DEMO_TOKEN) {
        return DEMO_USER;
      }
      
      const user = await apiService.get(ENDPOINTS.AUTH.ME);
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
