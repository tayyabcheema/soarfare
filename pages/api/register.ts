import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { first_name, last_name, email, password, password_confirmation } = req.body;
    const apiRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`,
      { first_name, last_name, email, password, password_confirmation },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    return res.status(apiRes.status).json(apiRes.data);
  } catch (error: any) {
    console.error('Register API Error:', error?.response?.data || error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
