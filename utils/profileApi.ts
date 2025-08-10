import axios from 'axios';

export async function updateUserProfile(token: string, data: { first_name: string; last_name: string; email: string; password?: string }) {
  const res = await axios.post(
    '/api/user/profile',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
