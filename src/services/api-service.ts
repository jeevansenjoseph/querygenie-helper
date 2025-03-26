
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './api-config';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

// Add a request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // For login and register endpoints, we don't need to add the token
    if (config.url && (
      config.url.includes('/auth/login/') || 
      config.url.includes('/auth/register/')
    )) {
      return config;
    }
    
    // Get token from storage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle general errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
      
      // Handle authentication errors (401 Unauthorized, 403 Forbidden)
      if (error.response.status === 401 || error.response.status === 403) {
        // Clear auth token
        localStorage.removeItem('authToken');
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Generic API service
export const apiService = {
  /**
   * Make a GET request
   */
  async get(url: string, config?: AxiosRequestConfig) {
    const response = await axiosInstance.get(url, config);
    return response.data;
  },
  
  /**
   * Make a POST request
   */
  async post(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  },
  
  /**
   * Make a PUT request
   */
  async put(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  },
  
  /**
   * Make a PATCH request
   */
  async patch(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await axiosInstance.patch(url, data, config);
    return response.data;
  },
  
  /**
   * Make a DELETE request
   */
  async delete(url: string, config?: AxiosRequestConfig) {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  }
};
