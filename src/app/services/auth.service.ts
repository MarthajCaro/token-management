import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'loggedUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // The credentials are verified on the server. The JWT it returns is the one
  // used as Bearer token for every protected request.
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.access_token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          localStorage.setItem('userId', res.user.id.toString());
          localStorage.setItem('role', res.user.role);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getLoggedUser(): AuthResponse['user'] | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }
}