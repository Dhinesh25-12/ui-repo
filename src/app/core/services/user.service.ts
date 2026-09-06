import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, ChangePasswordRequest, UpdateProfileRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiBaseUrl}/users/me`;

  constructor(private readonly http: HttpClient) {}

  getProfile(): Observable<AuthUser> {
    return this.http.get<AuthUser>(this.baseUrl);
  }

  updateProfile(payload: UpdateProfileRequest): Observable<AuthUser> {
    return this.http.put<AuthUser>(this.baseUrl, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/password`, payload);
  }
}
