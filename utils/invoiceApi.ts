import { InvoiceApiResponse } from '../types/invoice';
import axios from 'axios';

export async function fetchInvoices(params: any): Promise<InvoiceApiResponse> {
  // Get token from localStorage if available (only on client)
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }
  const res = await axios.post('/api/user/invoices', params, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-access-token': token } : {})
    }
  });
  return res.data;
}
