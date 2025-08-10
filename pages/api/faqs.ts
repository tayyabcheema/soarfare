import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/faqs`);
    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQs', error: error instanceof Error ? error.message : error });
  }
}
