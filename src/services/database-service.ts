
import { apiService } from './api-service';
import { ENDPOINTS } from './api-config';
import { DatabaseOption } from '@/lib/database';

export interface QueryGenerationRequest {
  naturalLanguage: string;
  databaseId: string;
  databaseType: 'sql' | 'nosql';
}

export interface QueryExecutionRequest {
  query: string;
  databaseId: string;
  databaseType: 'sql' | 'nosql';
}

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, any>[];
}

export interface NoSqlQueryResult {
  [key: string]: any;
}

export const databaseService = {
  /**
   * Generate SQL query from natural language
   */
  async generateSqlQuery(request: QueryGenerationRequest): Promise<string> {
    try {
      const response = await apiService.post<{ query: string }>(
        ENDPOINTS.DATABASE.SQL_GENERATE,
        request
      );
      return response.query;
    } catch (error) {
      console.error('SQL query generation error:', error);
      throw error;
    }
  },
  
  /**
   * Execute SQL query
   */
  async executeSqlQuery(request: QueryExecutionRequest): Promise<SqlQueryResult> {
    try {
      const response = await apiService.post<SqlQueryResult>(
        ENDPOINTS.DATABASE.SQL_EXECUTE,
        request
      );
      return response;
    } catch (error) {
      console.error('SQL query execution error:', error);
      throw error;
    }
  },
  
  /**
   * Generate NoSQL query from natural language
   */
  async generateNoSqlQuery(request: QueryGenerationRequest): Promise<string> {
    try {
      const response = await apiService.post<{ query: string }>(
        ENDPOINTS.DATABASE.NOSQL_GENERATE,
        request
      );
      return response.query;
    } catch (error) {
      console.error('NoSQL query generation error:', error);
      throw error;
    }
  },
  
  /**
   * Execute NoSQL query
   */
  async executeNoSqlQuery(request: QueryExecutionRequest): Promise<NoSqlQueryResult[]> {
    try {
      const response = await apiService.post<NoSqlQueryResult[]>(
        ENDPOINTS.DATABASE.NOSQL_EXECUTE,
        request
      );
      return response;
    } catch (error) {
      console.error('NoSQL query execution error:', error);
      throw error;
    }
  },
  
  /**
   * Get available databases
   */
  async getDatabases(): Promise<DatabaseOption[]> {
    try {
      // This endpoint is not defined in the API_ENDPOINTS
      // You would need to add it and implement it in the backend
      return apiService.get<DatabaseOption[]>('/databases');
    } catch (error) {
      console.error('Get databases error:', error);
      throw error;
    }
  }
};
