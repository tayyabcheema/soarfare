# SoarFare Frontend - API Integration Setup

## Overview
This document outlines the comprehensive API integration structure implemented for the SoarFare frontend application.

## Backend Configuration
- **API Base URL**: `https://admin.soarfare.com/api`
- **Authentication**: Bearer Token-based
- **CORS Handling**: Direct API calls configured for production deployment

## Core Components Implemented

### 1. API Client (`lib/api.ts`)
- Centralized API client with comprehensive error handling
- Support for both JSON and FormData requests
- Automatic token injection for authenticated requests
- Comprehensive endpoint coverage for all planned features

**Key Features:**
- Network error handling
- Response parsing with success/error states
- Token-based authentication
- Form data support for file uploads

### 2. Authentication Context (`contexts/AuthContext.tsx`)
- React Context for global authentication state management
- Secure token storage with expiration handling
- Automatic token validation on app initialization
- Redirect path management for seamless user experience

**Security Features:**
- Token expiration checking
- Automatic cleanup on logout
- Secure storage utilities
- Session persistence across browser sessions

### 3. Route Protection (`components/ProtectedRoute.tsx`)
- Higher-order component for route protection
- Flexible configuration for different protection levels
- Automatic redirects based on authentication state
- Loading states during authentication checks

### 4. Loading & Skeleton Components
- **Skeleton Components** (`components/ui/Skeleton.tsx`): Content placeholders while data loads
- **Loading Spinners** (`components/ui/LoadingSpinner.tsx`): Various loading indicators
- **Page Loaders**: Full-page loading states

**Skeleton Types:**
- Dashboard overview skeleton
- Table skeletons for data lists
- Card skeletons for content blocks
- Flight search results skeleton
- Blog list skeleton

### 5. Authentication Modal (`components/LoginModal.tsx`)
- Quick login modal for booking flows
- Integrated with AuthContext
- Responsive design with error handling
- Redirect support after successful login

## Updated Pages

### Login Page (`pages/login.tsx`)
- Integrated with AuthContext
- Protected route (redirects authenticated users)
- Loading states and error handling
- Automatic redirect after successful login

### Register Page (`pages/register.tsx`)
- Comprehensive registration form
- Form validation with real-time feedback
- Integrated with AuthContext
- Protected route configuration

### Dashboard Page (`pages/dashboard.tsx`)
- Protected route (requires authentication)
- Dynamic user information display
- Integrated logout functionality
- Real user data from AuthContext

### Header Component (`components/Header.tsx`)
- Dynamic authentication buttons
- User information display when logged in
- Logout functionality
- Responsive design for mobile and desktop

## API Endpoints Configured

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `GET /user` - Fetch user profile
- `POST /logout` - User logout

### Dashboard & User Management
- `GET /dashboard` - Dashboard data
- `POST /save-profile` - Update user profile

### Bookings
- `POST /booking-list` - Get user bookings
- `GET /booking-view/{id}` - Get booking details
- `POST /book-flight` - Create new booking

### Invoices
- `POST /invoice-list` - Get user invoices
- `GET /invoice-view/{id}` - Get invoice details

### Transfer Points
- `POST /transfer-point-list` - Get transfer history
- `POST /transfer-point-confirm` - Confirm point transfer

### Content Management
- `GET /blog` - Get blog posts
- `GET /blog-detail/{id}` - Get blog details
- `GET /testimonial-list` - Get testimonials
- `GET /testimonial-fetch/{id}` - Get testimonial details
- `GET /subscription-list` - Get subscription plans
- `GET /faq-list` - Get FAQ items

### Flight Operations
- `POST /flight-search` - Search flights
- `POST /book-flight` - Book selected flight

## Security Implementation

### Token Management
- Secure localStorage storage with expiration
- Automatic token validation
- Clean logout with token invalidation
- Session persistence across browser sessions

### Error Handling
- Network error recovery
- API error message display
- User-friendly error notifications
- Loading state management

### CORS Configuration
- Prepared for production deployment
- Direct API calls to backend
- Credential inclusion for authentication

## User Experience Features

### Authentication Flow
1. **Guest Users**: Can search flights but must login to book
2. **Login Required**: Modal appears when booking is attempted
3. **Seamless Redirects**: Users return to their intended page after login
4. **Persistent Sessions**: Users stay logged in across browser sessions

### Loading States
1. **Skeleton Loading**: Content outlines visible while data loads
2. **Button Loading**: Loading spinners in form submissions
3. **Page Loading**: Full-page loaders for route transitions
4. **Component Loading**: Individual component loading states

### Navigation Protection
1. **Dashboard Protection**: Requires authentication
2. **Auth Page Protection**: Redirects authenticated users
3. **Redirect Management**: Saves intended destination before login
4. **Automatic Redirects**: Smart routing based on user state

## Development Ready Features

### Ready for Integration
- All API endpoints structured and ready
- Error handling implemented
- Loading states in place
- User feedback systems active

### Extensible Architecture
- Easy to add new endpoints
- Modular component structure
- Reusable authentication patterns
- Scalable state management

## Next Steps for Integration

### 1. Flight Search Enhancement
- Integrate search results with real API
- Add booking flow with authentication check
- Implement payment integration (Stripe)

### 2. Dashboard Data Integration
- Connect dashboard components with real data
- Implement data refresh mechanisms
- Add real-time updates where needed

### 3. Profile Management
- Complete profile update functionality
- Add file upload for profile pictures
- Implement password change flow

### 4. Subscription & Payment
- Integrate Stripe for subscriptions
- Add point purchase functionality
- Implement payment history

## Configuration for Deployment

### Environment Variables Needed
```env
NEXT_PUBLIC_API_URL=https://admin.soarfare.com/api
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build Considerations
- All CORS handling configured for production
- No proxy dependencies
- Direct API communication
- Optimized for static deployment

This setup provides a robust, secure, and user-friendly foundation for the complete SoarFare application with all authentication and API integration infrastructure in place.
