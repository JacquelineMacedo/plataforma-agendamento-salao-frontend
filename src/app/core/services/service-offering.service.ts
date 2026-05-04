import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateServiceRequest, ServiceOffering } from '../models/service.models';

@Injectable({ providedIn: 'root' })
export class ServiceOfferingService {
  private readonly apiUrl = '/api/services';

  constructor(private http: HttpClient) {}

  getServices(): Observable<ServiceOffering[]> {
    return this.http.get<ServiceOffering[]>(this.apiUrl);
  }

  createService(request: CreateServiceRequest): Observable<ServiceOffering> {
    return this.http.post<ServiceOffering>(this.apiUrl, request);
  }
}
