export interface CreateBookingRequest {
  professionalId: string;
  serviceId: string;
  startTime: string;
  notes?: string;
}

export interface BookingResponse {
  id: string;
  customerId: string;
  professionalId: string;
  serviceId: string;
  startTimeUtc: string;
  endTimeUtc: string;
  status: 'CREATED' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
}
