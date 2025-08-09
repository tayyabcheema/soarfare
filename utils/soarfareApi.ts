// Utility for making API calls to SoarFare through our proxy
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

export class SoarFareApi {
    private static getAuthHeaders(token?: string) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }

    // Generic API call method
    static async call<T = any>(
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
            const config: RequestInit = {
                method,
                headers: this.getAuthHeaders(token),
            };
            
            if (data && method !== 'GET') {
                if (isFormData) {
                    // Remove Content-Type for FormData (browser will set it with boundary)
                    delete (config.headers as Record<string, string>)['Content-Type'];
                    config.body = data;
                } else {
                    config.body = JSON.stringify(data);
                }
            }
            
            const url = `/api/soarfare/${endpoint}`;
            console.log('Making API call to:', url); // Debug log
            const response = await fetch(url, config);
            const result = await response.json();
            
            return result;
        } catch (error) {
            console.error(`SoarFare API error (${endpoint}):`, error);
            return {
                success: false,
                message: 'Network error occurred'
            };
        }
    }

    // Specific API methods
    static async login(credentials: { email: string; password: string }) {
        const formData = new FormData();
        formData.append('email', credentials.email);
        formData.append('password', credentials.password);
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Login API error:', error);
            return {
                success: false,
                message: 'Network error occurred'
            };
        }
    }

    static async getDashboard(token: string) {
        return this.call('user/dashboard', {
            method: 'GET',
            token
        });
    }

    static async getBookings(token: string) {
        return this.call('user/bookings', {
            method: 'GET',
            token
        });
    }

    static async getInvoices(token: string) {
        return this.call('user/invoices', {
            method: 'GET',
            token
        });
    }

    static async getProfile(token: string) {
        return this.call('user/profile', {
            method: 'GET',
            token
        });
    }

    static async updateProfile(token: string, profileData: any) {
        return this.call('user/profile', {
            method: 'PUT',
            data: profileData,
            token
        });
    }

    static async transferPoints(token: string, transferData: any) {
        return this.call('user/transfer-points', {
            method: 'POST',
            data: transferData,
            token
        });
    }

    static async searchFlights(searchData: any, token?: string) {
        return this.call('flights/search', {
            method: 'POST',
            data: searchData,
            token
        });
    }

    static async bookFlight(bookingData: any, token: string) {
        return this.call('flights/book', {
            method: 'POST',
            data: bookingData,
            token
        });
    }
}

export default SoarFareApi;
