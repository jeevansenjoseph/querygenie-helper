
// API configuration settings
export const API_BASE_URL = 'https://your-django-api.com/api';  // Replace with actual API URL

// API endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    ME: '/auth/me/',
  },
  // Database endpoints
  DATABASE: {
    SQL_GENERATE: '/query/sql/generate/',
    SQL_EXECUTE: '/query/sql/execute/',
    NOSQL_GENERATE: '/query/nosql/generate/',
    NOSQL_EXECUTE: '/query/nosql/execute/',
  }
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Unified API config object
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS,
  REQUEST_TIMEOUT
};
