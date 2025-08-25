import apiClient from '../lib/api';

export interface FareRulesRequest {
  session_id: string;
  fare_source_code: string;
}

export interface FareRulesResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export class FareRulesApi {
  /**
   * Get fare rules for a specific flight
   * @param session_id - The session ID from flight search
   * @param fare_source_code - The fare source code from the selected flight
   * @param token - Optional authentication token
   * @returns Promise with fare rules data
   */
  static async getFareRules(
    session_id: string, 
    fare_source_code: string, 
    token?: string
  ): Promise<FareRulesResponse> {
    try {
      // Get token from localStorage if not provided
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('token') || undefined;
      }

      const response = await apiClient.getFareRules(
        { session_id, fare_source_code },
        token
      );

      return response;
    } catch (error) {
      console.error('Error fetching fare rules:', error);
      return {
        success: false,
        message: 'Failed to fetch fare rules',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get fare rules using the SoarFareApi utility
   * @param session_id - The session ID from flight search
   * @param fare_source_code - The fare source code from the selected flight
   * @param token - Optional authentication token
   * @returns Promise with fare rules data
   */
  static async getFareRulesViaSoarFareApi(
    session_id: string, 
    fare_source_code: string, 
    token?: string
  ): Promise<FareRulesResponse> {
    try {
      // Import SoarFareApi dynamically to avoid circular dependencies
      const { SoarFareApi } = await import('./soarfareApi');
      
      const response = await SoarFareApi.getFareRules(
        { session_id, fare_source_code },
        token
      );

      return response;
    } catch (error) {
      console.error('Error fetching fare rules via SoarFareApi:', error);
      return {
        success: false,
        message: 'Failed to fetch fare rules',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export default FareRulesApi;
