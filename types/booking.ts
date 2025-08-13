export interface BookingResponse {
    success: boolean;
    data: {
        bookingId: string;
        status: string;
        points: {
            used: number;
            remaining: number;
        };
        flight: {
            from: string;
            to: string;
            date: string;
            flightNumber: string;
            departureTime: string;
            arrivalTime: string;
        };
    };
}

export interface PointsPurchaseResponse {
    success: boolean;
    data: {
        transactionId: string;
        points: {
            purchased: number;
            newTotal: number;
        };
        payment: {
            amount: number;
            currency: string;
            status: string;
        };
    };
}

export interface FareSourceCodeResponse {
    fareSourceCode: string;
}

export interface UserPointsResponse {
    points: number;
}
