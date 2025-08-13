export interface BookingSegment {
  FlightNum: string;
  CarrierId: string;
  AircraftType: string;
  Origin: string;
  Destination: string;
  DepartureDateTime: string;
  ArrivalDateTime: string;
  ClassCode: string;
  CabinClassText: string;
  EquipmentType: string;
  OperatingCarrierId: string;
  Meal: string;
  SeatsRemaining: string;
  MajorClassCode: string;
  Distance: string;
  Duration: string;
  MarriageGroup: string;
}

export interface BookingFlight {
  origin: string;
  destination: string;
  departure_date: string;
  segments: BookingSegment[];
}

export interface Booking {
  id: number;
  trip_id: string;
  points: number;
  is_multi_city: number;
  ticket_issued: boolean;
  created_at: string;
  updated_at: string;
  flights: BookingFlight[];
}

export interface BookingApiResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Booking[];
}

export interface UserPointsResponse {
  points: number;
}

export interface FareSourceCodeResponse {
  fareSourceCode: string;
}

export interface IBookingResponseData {
  bookingId: string;
  status: string;
  points: {
    used: number;
    remaining: number;
  };
  flight: {
    from: string;
    to: string;
    date: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
  };
}

export interface IBookingResponse {
  success: boolean;
  bookingId: string;
  message: string;
}

export interface IPointsPurchaseResponseData {
  transactionId: string;
  points: {
    purchased: number;
    newTotal: number;
  };
  payment: {
    amount: number;
    currency: string;
    status: string;
  };
}

export interface IPointsPurchaseResponse {
  success: boolean;
  message: string;
  newPoints: number;
}

// This is what we're actually using in our mock implementation
export type BookingResponse = IBookingResponse;
export type PointsPurchaseResponse = IPointsPurchaseResponse;
