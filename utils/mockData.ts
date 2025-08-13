export const MOCK_USER_POINTS = 600;

export const MOCK_FARE_SOURCE_CODES = {
    'flight-0': 'anBwN01zSWNUUXJHcy9IaUdSMkpyNXZxNlFDMkhRYmtnSE1ON2Fnbjg0MGt4cWRaaFh3d2lYSzNwTDVMVnhRRE5PRDNRU3o1Uk11T1p4b252TmV1M1R1di8rQjEzQzRNcndFNDVFTUdwVWlGOStiVlZVbTRtV01WYzcyZDZERjVIMTVWK0pZV0ZLZG0wK1Jvdlp6bEZ3PT0=',
    'flight-1': 'R2k2ZFFTSFd2cW8reDRhSDlCQTlJSGlsOEt2M3UyUno2WkoybU4vbEFaN3F5RVRvUGV5NUVOZ1JWVG4vMXFTU3llTW5OdUdkSzJHKzJZQ2V4VmxpZEZwZDU3VE11WkpVdlVWZnlLUGJ2enp3bkN6T0JsZDNJVFl4MExxU1pJUFJxNDFEamo0bk1TRVZsNkFEcmcrUGdRPT0=',
    'flight-2': 'cmwzVHZEQ1FSL29SSFBQcGlVTEdNaUN4Y3RFZTZDM0lINkg1c0NuVllJRC9IcEJFNHVRdTRoTk8vWGV0YXNPRDVqL1BZWWhWZUxONk1iWFVBcVVsZ2RmdzdidmRtcDZIcDg5QWJ0UUJ5Q0Nad1k5TzFWZ3pzcGV2YTQ2dmNwM2t5aGNzZWlxVFpoNm8wOWNKWUpzeE9nPT0='
};

export const MOCK_FLIGHT_BOOKING_RESPONSE = {
    success: true,
    data: {
        bookingId: 'BOOK123456',
        status: 'confirmed',
        points: {
            used: 350,
            remaining: 79
        },
        flight: {
            from: 'ISB',
            to: 'DXB',
            date: '2025-08-13',
            flightNumber: 'PK233',
            departureTime: '01:20',
            arrivalTime: '03:45'
        }
    }
};

export const MOCK_POINTS_PURCHASE_RESPONSE = {
    success: true,
    data: {
        transactionId: 'TXN789012',
        points: {
            purchased: 52,
            newTotal: 481
        },
        payment: {
            amount: 195,
            currency: 'USD',
            status: 'completed'
        }
    }
};

export const MOCK_USER_PROFILE = {
    points: MOCK_USER_POINTS,
    paymentMethods: [
        {
            id: 'card_1',
            type: 'visa',
            last4: '4242',
            expiryMonth: 12,
            expiryYear: 2026
        }
    ]
};
