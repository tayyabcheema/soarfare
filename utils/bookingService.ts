import { 
    MOCK_FARE_SOURCE_CODES, 
    MOCK_FLIGHT_BOOKING_RESPONSE,
    MOCK_POINTS_PURCHASE_RESPONSE,
    MOCK_USER_PROFILE
} from './mockData';
import { 
    BookingResponse, 
    PointsPurchaseResponse, 
    FareSourceCodeResponse,
    UserPointsResponse,
    UserProfile
} from '../types/booking';
import apiClient from '../lib/api';

// Set this to false when real APIs are ready
const USE_MOCK_DATA = false;

class BookingService {
    static async getUserPoints(): Promise<UserPointsResponse> {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({ points: 600 }); // Fallback mock data
                }, 500); // Simulate API delay
            });
        }
        
        try {
            // Get token from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Fetch user dashboard data which includes points
            const response = await apiClient.getDashboard(token);
            
            if (response.success && response.data) {
                // Extract user points from dashboard response
                const userPoints = response.data.user_points || 0;
                return { points: userPoints };
            } else {
                throw new Error(response.message || 'Failed to fetch user points');
            }
        } catch (error) {
            console.error('Error fetching user points:', error);
            // Return fallback mock data if API fails
            return { points: 600 };
        }
    }

    static async getFareSourceCode(flightId: string): Promise<FareSourceCodeResponse> {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                setTimeout(() => {
                    const code = MOCK_FARE_SOURCE_CODES[flightId as keyof typeof MOCK_FARE_SOURCE_CODES];
                    resolve({ fareSourceCode: code || '' });
                }, 200);
            });
        }
        return Promise.reject('Real API not implemented yet');
    }

    static async bookFlight(flightData: any): Promise<BookingResponse> {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(MOCK_FLIGHT_BOOKING_RESPONSE);
                }, 1000);
            });
        }
        return Promise.reject('Real API not implemented yet');
    }

    static async purchasePoints(amount: number): Promise<PointsPurchaseResponse> {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(MOCK_POINTS_PURCHASE_RESPONSE);
                }, 1500);
            });
        }
        return Promise.reject('Real API not implemented yet');
    }

    static async getUserProfile(): Promise<UserProfile> {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(MOCK_USER_PROFILE);
                }, 300);
            });
        }
        
        try {
            // Get token from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Fetch user profile data
            const response = await apiClient.getUserProfile(token);
            
            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // Return fallback mock data if API fails
            return MOCK_USER_PROFILE;
        }
    }
}

export default BookingService;
