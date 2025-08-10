import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/invoices/datatable`;

    // The client should send the token in a custom header, e.g., 'x-access-token'
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    const axiosRes = await axios.post(apiUrl, req.body, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      // Optionally, you can forward cookies if needed
      // withCredentials: true,
    });
    res.status(axiosRes.status).json(axiosRes.data);
  } catch (error: any) {
    console.error('Error fetching invoices:', error?.response?.data || error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
