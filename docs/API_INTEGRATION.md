# SoarFare API Integration Guide

This document explains how to use the SoarFare API integration in the frontend application.

## Overview

All SoarFare API calls are now routed through Next.js API proxy routes to avoid CORS issues. The system includes:

1. **Generic API Proxy**: `/pages/api/soarfare/[...endpoint].ts` - Handles any SoarFare API endpoint
2. **Utility Class**: `/utils/soarfareApi.ts` - Provides typed methods for common API calls
3. **Specific Proxies**: Individual proxy routes for specific endpoints (like `/api/login`, `/api/dashboard`)

## Usage Examples

### Basic API Calls

```typescript
import SoarFareApi from '../utils/soarfareApi';

// Login
const result = await SoarFareApi.login({
    email: 'user@example.com',
    password: 'password123'
});

// Get Dashboard Data
const dashboard = await SoarFareApi.getDashboard(token);

// Get User Bookings
const bookings = await SoarFareApi.getBookings(token);

// Update Profile
const updated = await SoarFareApi.updateProfile(token, {
    first_name: 'John',
    last_name: 'Doe'
});
```

### Generic API Calls

For endpoints not yet added to the utility class:

```typescript
// GET request
const result = await SoarFareApi.call('user/settings', {
    method: 'GET',
    token: userToken
});

// POST request with JSON data
const result = await SoarFareApi.call('flights/search', {
    method: 'POST',
    data: { 
        from: 'NYC', 
        to: 'LAX',
        date: '2024-12-01'
    },
    token: userToken
});

// POST request with FormData
const formData = new FormData();
formData.append('file', fileObject);
const result = await SoarFareApi.call('user/upload-avatar', {
    method: 'POST',
    data: formData,
    isFormData: true,
    token: userToken
});
```

## Available API Methods

### Authentication
- `SoarFareApi.login(credentials)` - User login

### User Data
- `SoarFareApi.getDashboard(token)` - Get dashboard data
- `SoarFareApi.getProfile(token)` - Get user profile
- `SoarFareApi.updateProfile(token, data)` - Update user profile

### Bookings & Transactions
- `SoarFareApi.getBookings(token)` - Get user bookings
- `SoarFareApi.getInvoices(token)` - Get user invoices
- `SoarFareApi.transferPoints(token, data)` - Transfer points

### Flights
- `SoarFareApi.searchFlights(data, token)` - Search flights
- `SoarFareApi.bookFlight(data, token)` - Book a flight

## Error Handling

All API methods return a consistent response format:

```typescript
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}
```

Example error handling:

```typescript
const result = await SoarFareApi.getDashboard(token);

if (result.success) {
    // Handle success
    console.log('Dashboard data:', result.data);
} else {
    // Handle error
    console.error('Error:', result.message);
    toast.error(result.message || 'An error occurred');
}
```

## Adding New API Endpoints

To add a new API endpoint:

1. **Option 1**: Add a method to the `SoarFareApi` class in `/utils/soarfareApi.ts`
2. **Option 2**: Use the generic `SoarFareApi.call()` method directly
3. **Option 3**: Create a specific proxy route in `/pages/api/` if needed

### Example: Adding a new method

```typescript
// In /utils/soarfareApi.ts
static async getNotifications(token: string) {
    return this.call('user/notifications', {
        method: 'GET',
        token
    });
}

static async markNotificationRead(token: string, notificationId: string) {
    return this.call(`user/notifications/${notificationId}/read`, {
        method: 'POST',
        token
    });
}
```

## CORS Solution

The proxy system solves CORS issues by:

1. **Frontend** makes requests to `/api/soarfare/*` (same origin)
2. **Next.js API route** forwards the request to `https://admin.soarfare.com/api/*`
3. **Server-to-server** communication has no CORS restrictions
4. **Response** is forwarded back to the frontend

This ensures all API calls work without CORS errors while maintaining the same API structure.

## Authentication

Bearer tokens are automatically handled by the utility methods. Just pass the token as a parameter:

```typescript
const token = localStorage.getItem('token');
const result = await SoarFareApi.getDashboard(token);
```

The proxy routes automatically format the Authorization header as `Bearer ${token}`.
