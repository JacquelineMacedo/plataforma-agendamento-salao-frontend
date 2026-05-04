export interface ServiceOffering {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}
