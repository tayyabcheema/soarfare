import { BookingApiResponse } from '../types/booking';
import axios from 'axios';

export async function fetchBookings(params: any): Promise<BookingApiResponse> {
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }
  const res = await axios.post('/api/user/bookings', params, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-access-token': token } : {})
    }
  });
  return res.data;
}
