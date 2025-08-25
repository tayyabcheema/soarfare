# Fare Rules API Integration

This document describes how to integrate the Fare Rules API into your SoarFare application.

## Overview

The Fare Rules API allows you to retrieve detailed fare rules and restrictions for a specific flight. This is typically used after a flight search to show users the terms and conditions associated with their selected fare.

## API Endpoint

**URL:** `POST /api/fare-rules`

**Base URL:** `https://admin.soarfare.com` (handled via proxy to avoid CORS)

## Request Format

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (optional, retrieved from localStorage if not provided)

### Request Body
```json
{
  "session_id": "68aa0065ab5aa6834D0AF-F32F-45FE-9224-E6E52EC81D6E-29068aa0065ab5ae",
  "fare_source_code": "SWhuQ2JyVkhWclIvNjZhNzBCTHlvdG1CeGdjalRheWJQcXBraFlweVhHa3NNbjdZODJDVkNINkhLemd6eEhJYi91cVZlQUJuVERTQS9ma29BMFc5d0RyM0F1TG9zWlA4bnVRUXI3OG1PWWZDM3NvMm5MY29FQXl4QkZGUXhjVWhtM1hwdGx6UU96QmdsNDljS1RvcTZ3PT0="
}
```

### Parameters
- `session_id` (required): Session ID from the flight search response
- `fare_source_code` (required): Fare source code from the selected flight's fare information

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Fare rules data structure will depend on the backend response
    "rules": {
      "cancellation": "Cancellation allowed with fee",
      "change": "Date change allowed with fee",
      "refund": "Non-refundable",
      "baggage": "1 checked bag included"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Integration Methods

### Method 1: Using the API Client

```typescript
import apiClient from '../lib/api';

const response = await apiClient.getFareRules(
  { session_id, fare_source_code },
  token
);

if (response.success) {
  console.log('Fare rules:', response.data);
} else {
  console.error('Error:', response.message);
}
```

### Method 2: Using the FareRulesApi Utility

```typescript
import FareRulesApi from '../utils/fareRulesApi';

const response = await FareRulesApi.getFareRules(
  sessionId,
  fareSourceCode
);

if (response.success) {
  console.log('Fare rules:', response.data);
} else {
  console.error('Error:', response.message);
}
```

### Method 3: Using SoarFareApi Utility

```typescript
import { SoarFareApi } from '../utils/soarfareApi';

const response = await SoarFareApi.getFareRules(
  { session_id, fare_source_code },
  token
);

if (response.success) {
  console.log('Fare rules:', response.data);
} else {
  console.error('Error:', response.message);
}
```

## Usage in Components

### Example: FareRulesModal Component

```typescript
import React, { useState, useEffect } from 'react';
import FareRulesApi from '../utils/fareRulesApi';

const FareRulesModal = ({ sessionId, fareSourceCode }) => {
  const [fareRules, setFareRules] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFareRules = async () => {
    setLoading(true);
    try {
      const response = await FareRulesApi.getFareRules(sessionId, fareSourceCode);
      if (response.success) {
        setFareRules(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch fare rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId && fareSourceCode) {
      fetchFareRules();
    }
  }, [sessionId, fareSourceCode]);

  // Render fare rules UI
};
```

## Integration with Flight Search

The fare rules API is typically used after a flight search. Here's the typical flow:

1. **Flight Search**: User searches for flights
2. **Flight Selection**: User selects a flight from search results
3. **Get Fare Rules**: Call the fare rules API with the session_id and fare_source_code
4. **Display Rules**: Show fare rules in a modal or dedicated page

### Example Integration in FlightCard

```typescript
const FlightCard = ({ flight }) => {
  const [showFareRules, setShowFareRules] = useState(false);

  const handleShowFareRules = () => {
    setShowFareRules(true);
  };

  return (
    <div>
      {/* Flight information */}
      <button onClick={handleShowFareRules}>
        View Fare Rules
      </button>
      
      {showFareRules && (
        <FareRulesModal
          sessionId={flight.sessionId}
          fareSourceCode={flight.fareSourceCode}
          onClose={() => setShowFareRules(false)}
        />
      )}
    </div>
  );
};
```

## Error Handling

The API includes comprehensive error handling:

- **Network Errors**: Handled automatically with user-friendly messages
- **Validation Errors**: Session ID and fare source code validation
- **Authentication Errors**: Token validation and refresh handling
- **Backend Errors**: Proper error propagation from the backend API

## CORS Handling

The API is implemented as a proxy endpoint to avoid CORS issues:

- Client-side requests go to `/api/fare-rules`
- The proxy forwards requests to `https://admin.soarfare.com/api/fare-rules`
- Authentication tokens are automatically included
- Response is returned to the client

## Testing

You can test the API using the example page at `/fare-rules-example` which includes:

- Interactive form with sample data
- Real-time API testing
- Response visualization
- Error handling demonstration

## Security Considerations

- Authentication tokens are automatically retrieved from localStorage
- All requests are validated on both client and server side
- Sensitive data is not logged in production
- CORS is properly handled through the proxy

## Troubleshooting

### Common Issues

1. **Missing Session ID**: Ensure the session ID is from a recent flight search
2. **Invalid Fare Source Code**: Verify the fare source code matches the selected flight
3. **Authentication Errors**: Check if the user is logged in and token is valid
4. **Network Errors**: Verify the backend API is accessible

### Debug Information

The API includes comprehensive logging:

- Request data logging
- Response status and headers
- Error details
- Authentication status

Check the browser console and server logs for detailed information.
