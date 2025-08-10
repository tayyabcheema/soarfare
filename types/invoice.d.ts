export interface Invoice {
  id: number;
  title: string;
  amount: string;
  formatted_amount: string;
  start_date: string;
  end_date: string;
  invoice_id: string;
  points: number;
  created_at: string | null;
  updated_at: string | null;
  date_range: string;
}

export interface InvoiceApiResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Invoice[];
}
