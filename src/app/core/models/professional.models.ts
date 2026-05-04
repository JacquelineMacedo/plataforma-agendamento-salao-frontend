export interface Professional {
  id: string;
  fullName: string;
  email: string;
  active: boolean;
}

export interface CreateProfessionalRequest {
  fullName: string;
  email: string;
  active: boolean;
}

export interface ProfessionalAvailability {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}
