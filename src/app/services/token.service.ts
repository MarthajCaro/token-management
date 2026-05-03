import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, 
  private authService: AuthService) 
  {}
   // GET - Get all tokens 
  getToken(): Observable<any> {
    return this.authService.getTokenAuth().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
  
        return this.http.get(`${this.baseUrl}/tokens`, { headers });
      })
    );
  }
   // POST - Create a new token
  createToken(tokenData: any): Observable<any> {
    return this.authService.getTokenAuth().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        return this.http.post(`${this.baseUrl}/tokens`, tokenData, { headers });
      })
    );
  }
  updateToken(id: number, tokenData: any): Observable<any> {
  return this.authService.getTokenAuth().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      return this.http.put(`${this.baseUrl}/tokens/${id}`, tokenData, { headers });
    })
  );
}

deleteToken(id: number): Observable<any> {
  return this.authService.getTokenAuth().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.delete(`${this.baseUrl}/tokens/${id}`, { headers });
    })
  );
}
}
