import { NextApiRequest, NextApiResponse } from 'next';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    console.log('🚀 Fare rules API called with data:', req.body);
    
    const fareRulesData: FareRulesRequest = req.body;

    // Get authorization token from request headers
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    // Validate required fields
    if (!fareRulesData.session_id) {
      return res.status(422).json({
        success: false,
        message: 'session_id is required',
      });
    }

    if (!fareRulesData.fare_source_code) {
      return res.status(422).json({
        success: false,
        message: 'fare_source_code is required',
      });
    }

    console.log('✅ Validation passed, preparing request to backend...');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log('🔑 Using auth token');
    } else {
      console.log('⚠️ No auth token provided');
    }

    console.log('📡 Sending request to backend API...');
    console.log('🔗 URL: https://admin.soarfare.com/api/fare-rules');
    console.log('📝 Request data:', JSON.stringify(fareRulesData, null, 2));

    // Forward request to the actual backend
    const response = await fetch('https://admin.soarfare.com/api/fare-rules', {
      method: 'POST',
      headers,
      body: JSON.stringify(fareRulesData),
    });

    console.log('📥 Backend response status:', response.status);
    console.log('📋 Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend API error:', response.status, errorText);
      return res.status(response.status).json({ 
        success: false, 
        message: `Backend API error: ${response.status}`,
        error: errorText
      });
    }

    const data = await response.json();
    console.log('✅ Backend response data:', data);

    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Error in fare-rules API:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
