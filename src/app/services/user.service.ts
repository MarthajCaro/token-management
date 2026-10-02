import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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

  private filterParams(name?: string, role?: string): HttpParams {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (role) params = params.set('role', role);
    return params;
  }

  // GET - Search users
  searchUsers(name?: string, role?: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`, {
      headers: this.authHeaders(),
      params: this.filterParams(name, role)
    });
  }

  // GET - Get all users
  getUser(name?: string, role?: string): Observable<any> {
    return this.searchUsers(name, role);
  }

  // (POST) Create user
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, userData, { headers: this.authHeaders() });
  }

  // (PUT) Update user
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, userData, { headers: this.authHeaders() });
  }

  // (DELETE) Delete user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers: this.authHeaders() });
  }
}