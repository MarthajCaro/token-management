import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface TokenData {
  access_token: string,
  token_type: string,
  expires_in: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTokenAuth(): Observable<string> {
    const body = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret
    };

    return this.http.post<TokenData>(`${this.baseUrl}/auth/token`, body)
    .pipe(map((res : any) => res.access_token)); 
  }
}
