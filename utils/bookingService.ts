import { 
    MOCK_USER_POINTS, 
    MOCK_FARE_SOURCE_CODES, 
    MOCK_FLIGHT_BOOKING_RESPONSE,
    MOCK_POINTS_PURCHASE_RESPONSE,
    MOCK_USER_PROFILE
} from './mockData';
import { 
    BookingResponse, 
    PointsPurchaseResponse, 
    FareSourceCodeResponse,
    UserPointsResponse 
} from '../types/booking';

// Set this to false when real APIs are ready
const USE_MOCK_DATA = true;

class BookingService {
    static async getUserPoints(): Promise<UserPointsResponse> {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({ points: MOCK_USER_POINTS });
                }, 500); // Simulate API delay
            });
        }
        // Real API call will go here
        return Promise.reject('Real API not implemented yet');
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

    static async getUserProfile() {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(MOCK_USER_PROFILE);
                }, 300);
            });
        }
        return Promise.reject('Real API not implemented yet');
    }
}

export default BookingService;
