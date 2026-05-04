import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateProfessionalRequest,
  Professional,
  ProfessionalAvailability
} from '../models/professional.models';

@Injectable({ providedIn: 'root' })
export class ProfessionalService {
  private readonly apiUrl = '/api/professionals';

  constructor(private http: HttpClient) {}

  getProfessionals(): Observable<Professional[]> {
    return this.http.get<Professional[]>(this.apiUrl);
  }

  createProfessional(request: CreateProfessionalRequest): Observable<Professional> {
    return this.http.post<Professional>(this.apiUrl, request);
  }

  getAvailabilities(professionalId: string): Observable<ProfessionalAvailability[]> {
    return this.http.get<ProfessionalAvailability[]>(
      `${this.apiUrl}/${professionalId}/availabilities`
    );
  }

  upsertAvailabilities(
    professionalId: string,
    availabilities: Omit<ProfessionalAvailability, 'id'>[]
  ): Observable<ProfessionalAvailability[]> {
    return this.http.put<ProfessionalAvailability[]>(
      `${this.apiUrl}/${professionalId}/availabilities`,
      availabilities
    );
  }
}
