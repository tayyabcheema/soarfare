import axios, { AxiosRequestConfig } from 'axios';
// API Configuration and Client
// Use '/api' for client-side requests, but allow direct backend URL for server-side/proxy
export const API_BASE_URL = typeof window === 'undefined'
  ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.soarfare.com'
  : '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  tier_id: number | null;
  profile_photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  user: User;
  user_points: number;
  altitude_points: number;
  tier: any | null;
  package: any | null;
  search_params: any | null;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface LoginData {
  token: string;
  user: User;
}

// Flight Search Types
export interface FlightSearchData {
  travel_date: string;
  from: string;
  to: string;
  class: string;
  adults: number;
  childs: number;
  infants: number;
  flight_type?: number; // 1 = one-way, 2 = return, 3 = multi-city
  return_date?: string;
  from_mc?: string[];
  to_mc?: string[];
  travel_date_mc?: string[];
}

export interface FlightSegment {
  FlightNumber: string;
  DepartureAirportLocationCode: string;
  ArrivalAirportLocationCode: string;
  DepartureDateTime: string;
  ArrivalDateTime: string;
  CabinClassText: string;
  MarketingAirlineCode: string;
  OperatingAirlineCode?: string;
  StopQuantity?: number;
}

export interface FareItinerary {
  DirectionInd: string;
  AirItineraryFareInfo: {
    TotalFare: {
      Amount: string;
      CurrencyCode: string;
    };
    FareSourceCode: string;
  };
  OriginDestinationOptions: Array<{
    FlightSegment: FlightSegment;
  }>;
}

export interface FlightSearchResponse {
  success: number;
  data: {
    flights: {
      AirSearchResponse: {
        session_id: string;
        trawex_session_id?: string;
        AirSearchResult: {
          FareItineraries: Array<{
            FareItinerary: FareItinerary;
          }>;
        };
      };
    };
    airlines: Record<string, string>;
    airports: Record<string, {
      name: string;
      iata: string;
      city?: string;
      country?: string;
    }>;
  };
  session_data?: {
    session_id: string;
    trawex_session_id: string | null;
    timestamp: string;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || 'Request failed',
          error: data.error
        };
      }

      // For flight search API, return the raw response since it has its own success format
      if (data.success !== undefined && typeof data.success === 'number') {
        return data; // Return raw response for flight search
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to parse response',
        error: 'Parse error'
      };
    }
  }

  async request<T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      data?: any;
      token?: string;
      isFormData?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', data, token, isFormData = false } = options;
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = this.getAuthHeaders(token);
      let axiosConfig: AxiosRequestConfig = {
        url,
        method,
        headers,
        withCredentials: true,
      };
      if (data && method !== 'GET') {
        if (isFormData) {
          // Remove Content-Type for FormData (browser sets it with boundary)
          if (axiosConfig.headers) {
            delete axiosConfig.headers['Content-Type'];
          }
          axiosConfig.data = data instanceof FormData ? data : this.createFormData(data);
        } else {
          axiosConfig.data = data;
        }
      }
      const response = await axios(axiosConfig);
      return this.handleAxiosResponse<T>(response);
    } catch (error: any) {
      if (error.response) {
        return this.handleAxiosResponse<T>(error.response);
      }
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        message: 'Network error occurred. Please check your connection.',
        error: 'Network error'
      };
    }
  }

  private handleAxiosResponse<T>(response: any): ApiResponse<T> {
    const data = response.data;
    if (response.status < 200 || response.status >= 300) {
      return {
        success: false,
        message: data.message || data.error || 'Request failed',
        error: data.error
      };
    }
    if (data.success !== undefined && typeof data.success === 'number') {
      return data;
    }
    return {
      success: true,
      data: data.data || data,
      message: data.message
    };
  }

  private createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<LoginData>> {
    // Use local API proxy to avoid CORS issues
    return this.request<LoginData>('/auth/login', {
      method: 'POST',
      data: credentials,
      isFormData: false // Send as JSON to our proxy
    });
  }

  async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse<LoginData>> {
    // Use local API proxy to avoid CORS issues and send as form-data
    const formData = new FormData();
    formData.append('first_name', userData.first_name);
    formData.append('last_name', userData.last_name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('password_confirmation', userData.password_confirmation);
  return this.request<LoginData>('/auth/register', {
      method: 'POST',
      data: formData,
      isFormData: true
    });
  }

  async fetchUser(token: string): Promise<ApiResponse<User>> {
    return this.request<User>('/user', {
      method: 'GET',
      token
    });
  }

  async getUserProfile(token: string): Promise<ApiResponse<User>> {
    return this.request<User>('/user/me', {
      method: 'GET',
      token
    });
  }

  async saveUserProfile(token: string, profileData: {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
  }): Promise<ApiResponse> {
    return this.request('/user/profile', {
      method: 'POST',
      data: profileData,
      token
    });
  }

  async logout(token: string): Promise<ApiResponse> {
    return this.request('/logout', {
      method: 'POST',
      token
    });
  }

  // Dashboard endpoints
  async getDashboard(token: string): Promise<ApiResponse> {
    return this.request('/user/dashboard', {
      method: 'GET',
      token
    });
  }

  // Booking endpoints
  async getBookings(token: string, filters?: any): Promise<ApiResponse> {
    return this.request('/booking-list', {
      method: 'POST',
      data: filters || {},
      token
    });
  }

  async getBookingDetails(bookingId: string, token: string): Promise<ApiResponse> {
    return this.request(`/booking-view/${bookingId}`, {
      method: 'GET',
      token
    });
  }

  // Transfer Points endpoints

  async getTransferPointsList(token: string, filters?: any): Promise<ApiResponse> {
    return this.request('/transfer-point-list', {
      method: 'POST',
      data: filters || {},
      token
    });
  }

  async getTransferPointsHistory(token: string, params: any): Promise<ApiResponse> {
    return this.request('/user/transfer-points/datatable', {
      method: 'POST',
      data: params,
      token
    });
  }

  async confirmTransferPoints(token: string, transferData: any): Promise<ApiResponse> {
  return this.request('/user/transfer-points/confirm', {
      method: 'POST',
      data: transferData,
      token
    });
  }

  // Invoice endpoints
  async getInvoices(token: string, filters?: any): Promise<ApiResponse> {
    return this.request('/invoice-list', {
      method: 'POST',
      data: filters || {},
      token
    });
  }

  async getInvoiceDetails(invoiceId: string, token: string): Promise<ApiResponse> {
    return this.request(`/invoice-view/${invoiceId}`, {
      method: 'GET',
      token
    });
  }

  // Profile endpoints
  async saveProfile(token: string, profileData: any): Promise<ApiResponse> {
    return this.request('/save-profile', {
      method: 'POST',
      data: profileData,
      token
    });
  }

  // Blog endpoints
  async getBlogs(filters?: any): Promise<ApiResponse> {
    return this.request('/blog', {
      method: 'GET',
      data: filters
    });
  }

  async getBlogDetails(blogId: string): Promise<ApiResponse> {
    return this.request(`/blog-detail/${blogId}`, {
      method: 'GET'
    });
  }

  // Testimonial endpoints
  async getTestimonials(): Promise<ApiResponse> {
    return this.request('/testimonial-list', {
      method: 'GET'
    });
  }

  async getTestimonialDetails(testimonialId: string): Promise<ApiResponse> {
    return this.request(`/testimonial-fetch/${testimonialId}`, {
      method: 'GET'
    });
  }

  // Subscription endpoints
  async getSubscriptions(): Promise<ApiResponse> {
    return this.request('/subscription-list', {
      method: 'GET'
    });
  }

  // FAQ endpoints
  async getFAQs(): Promise<ApiResponse> {
    return this.request('/faq-list', {
      method: 'GET'
    });
  }

  // Flight search and booking
  async searchFlights(searchData: FlightSearchData, token?: string): Promise<FlightSearchResponse> {
    const response = await this.request<FlightSearchResponse>('/get-flights', {
      method: 'POST',
      data: searchData,
      token
    });
    
    // Return the raw response for flight search since it has a different format
    return response as any;
  }

  async bookFlight(bookingData: any, token: string): Promise<ApiResponse> {
    return this.request('/book-flight', {
      method: 'POST',
      data: bookingData,
      token
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
