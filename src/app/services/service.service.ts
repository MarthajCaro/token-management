import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  //  GET - Get all services
  getServices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services`, { headers: this.authHeaders() });
  }

  // POST - Create a new service
  createService(serviceData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/services`, serviceData, { headers: this.authHeaders() });
  }

  // PUT - Update a service
  updateService(id: number, serviceData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/services/${id}`, serviceData, { headers: this.authHeaders() });
  }

  //  DELETE - Delete a service
  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/services/${id}`, { headers: this.authHeaders() });
  }
}