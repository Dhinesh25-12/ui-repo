import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private readonly baseUrl = `${environment.apiBaseUrl}/admin/users`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(this.baseUrl);
  }

  updateRoles(userId: number, roles: UserRole[]): Observable<AuthUser> {
    return this.http.put<AuthUser>(`${this.baseUrl}/${userId}/roles`, { roles });
  }

  setEnabled(userId: number, enabled: boolean): Observable<AuthUser> {
    return this.http.patch<AuthUser>(`${this.baseUrl}/${userId}/status`, { enabled });
  }
}
