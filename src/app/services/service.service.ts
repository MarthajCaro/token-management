import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
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

  //  GET - Get all services
  getServices(): Observable<any> {
    return this.authService.getTokenAuth().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
        return this.http.get(`${this.baseUrl}/services`, { headers });
      })
    );
  }

  // POST - Create a new service
  createService(serviceData: any): Observable<any> {
    return this.authService.getTokenAuth().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        return this.http.post(`${this.baseUrl}/services`, serviceData, { headers });
      })
    );
  }

  // PUT - Update a service
  updateService(id: number, serviceData: any): Observable<any> {
    return this.authService.getTokenAuth().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        return this.http.put(`${this.baseUrl}/services/${id}`, serviceData, { headers });
      })
    );
  }

  //  DELETE - Delete a service
  deleteService(id: number): Observable<any> {
    return this.authService.getTokenAuth().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
        return this.http.delete(`${this.baseUrl}/services/${id}`, { headers });
      })
    );
  }
}
