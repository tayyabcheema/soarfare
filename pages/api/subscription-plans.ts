import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plans`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Subscription plans API error:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.message || 'Failed to fetch subscription plans',
        error: error.response.data
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: 'Network error'
    });
  }
}


