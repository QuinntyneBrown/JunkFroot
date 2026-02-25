import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import {
  AuthResponse,
  CustomerProfile,
  LoginRequest,
  ProfileUpdateRequest,
  RefreshResponse,
  RegisterRequest,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/identity/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/identity/login`, request);
  }

  refresh(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.baseUrl}/api/identity/refresh`, {});
  }

  getProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(`${this.baseUrl}/api/identity/profile`);
  }

  updateProfile(request: ProfileUpdateRequest): Observable<CustomerProfile> {
    return this.http.put<CustomerProfile>(`${this.baseUrl}/api/identity/profile`, request);
  }

  uploadAvatar(file: File): Observable<CustomerProfile> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<CustomerProfile>(
      `${this.baseUrl}/api/identity/profile/avatar`,
      formData
    );
  }
}
