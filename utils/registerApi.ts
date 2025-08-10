import axios from 'axios';

export async function registerUser(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const res = await axios.post('/api/register', data, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return res.data;
}
