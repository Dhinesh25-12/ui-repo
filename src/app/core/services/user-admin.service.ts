import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthUser, UserRole } from '../models/user.model';
import { PageResponse } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private readonly baseUrl = `${environment.apiBaseUrl}/admin/users`;

  constructor(private readonly http: HttpClient) {}

  /** Backend returns a paginated `Page<UserResponse>`; unwrap to the flat list the UI needs. */
  getAll(): Observable<AuthUser[]> {
    return this.http.get<PageResponse<AuthUser>>(this.baseUrl).pipe(map((page) => page.content));
  }

  updateRoles(userId: number, roles: UserRole[]): Observable<AuthUser> {
    return this.http.put<AuthUser>(`${this.baseUrl}/${userId}/roles`, { roles });
  }

  setEnabled(userId: number, enabled: boolean): Observable<AuthUser> {
    return this.http.patch<AuthUser>(`${this.baseUrl}/${userId}/status`, { enabled });
  }
}
