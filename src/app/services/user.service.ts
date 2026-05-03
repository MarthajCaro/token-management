import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) {}
  searchUsers(name?: string, role?: string): Observable<any> {
  return this.authService.getTokenAuth().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      // Build dynamic parameters
      let params: any = {};
      if (name) params.name = name;
      if (role) params.role = role;

      return this.http.get(`${this.baseUrl}/users`, { headers, params });
    })
  );
}
  
  // GET - Get all user
  getUser(name?: string, role?: string): Observable<any> {
  return this.authService.getTokenAuth().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      let params: any = {};

      if (name) params.name = name;
      if (role) params.role = role;

      return this.http.get(`${this.baseUrl}/users`, { headers, params });
    })
  );
}
  
  // (POST) Create user 
  createUser(userData: any): Observable<any> {
  return this.authService.getTokenAuth().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      return this.http.post(`${this.baseUrl}/users`, userData, { headers });
    })
  ); 
}
// (PUT)- Update user 
updateUser(id: number, userData: any): Observable<any> {
  return this.authService.getTokenAuth().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.put(`${this.baseUrl}/users/${id}`, userData, { headers });
    })
  );
}
// (DELETE)- Delete user 
deleteUser(id: number): Observable<any> {
  return this.authService.getTokenAuth().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.delete(`${this.baseUrl}/users/${id}`, { headers });
    })
  );
}
// (POST) Login - Verify user credentials
loginUser(email: string, password: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/login`, { email, password });
}

}
