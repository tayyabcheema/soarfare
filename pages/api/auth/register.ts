import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, password, password_confirmation, phone } = req.body;

    // Create FormData for the backend API
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);
    if (phone) {
      formData.append('phone', phone);
    }

    // Forward request to the actual backend
    const response = await fetch('https://admin.soarfare.com/api/register', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    // Forward the response back to the frontend
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Register proxy error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
