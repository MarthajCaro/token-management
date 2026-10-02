import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
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

  // GET - Get all tokens
  getToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tokens`, { headers: this.authHeaders() });
  }

  // POST - Create a new token
  createToken(tokenData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tokens`, tokenData, { headers: this.authHeaders() });
  }

  // PUT - Update a token
  updateToken(id: number, tokenData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/tokens/${id}`, tokenData, { headers: this.authHeaders() });
  }

  // DELETE - Delete a token
  deleteToken(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tokens/${id}`, { headers: this.authHeaders() });
  }
}