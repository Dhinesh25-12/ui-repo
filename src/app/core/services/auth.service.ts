import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest, UserRole } from '../models/user.model';
import { NotificationService } from './notification.service';

const TOKEN_KEY = 'ip_auth_token';
const USER_KEY = 'ip_auth_user';
const EXPIRES_AT_KEY = 'ip_auth_expires_at';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<AuthUser | null>(this.readStoredUser());
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly roles = computed<UserRole[]>(() => this.currentUserSignal()?.roles ?? []);

  constructor(
    private readonly http: HttpClient,
    private readonly notifications: NotificationService
  ) {
    this.scheduleAutoLogoutFromStorage();
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, payload).pipe(
      tap((response) => this.setSession(response))
    );
  }

  register(payload: RegisterRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${environment.apiBaseUrl}/auth/register`, payload);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.clearLogoutTimer();
  }

  hasRole(role: UserRole): boolean {
    return this.roles().includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const current = this.roles();
    return roles.some((r) => current.includes(r));
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.tokenSignal.set(response.token);
    this.currentUserSignal.set(response.user);

    if (response.expiresIn && response.expiresIn > 0) {
      const expiresInMs = response.expiresIn * 1000;
      localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + expiresInMs));
      this.scheduleAutoLogout(expiresInMs);
    } else {
      localStorage.removeItem(EXPIRES_AT_KEY);
      this.clearLogoutTimer();
    }
  }

  /**
   * On app start, resumes the session-timeout countdown from a previously
   * stored expiry so a page refresh doesn't reset it, and immediately logs
   * out if the token already expired while the app was closed.
   */
  private scheduleAutoLogoutFromStorage(): void {
    const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY));
    if (!expiresAt) {
      return;
    }
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      this.logout();
      return;
    }
    this.scheduleAutoLogout(remaining);
  }

  private scheduleAutoLogout(ms: number): void {
    this.clearLogoutTimer();
    this.logoutTimer = setTimeout(() => {
      this.logout();
      this.notifications.info('Your session has expired. Please log in again.');
    }, ms);
  }

  private clearLogoutTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
