import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('starts unauthenticated when there is no stored token', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('stores token and user on successful login', () => {
    service.login({ username: 'admin', password: 'secret' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({
      token: 'fake-jwt-token',
      user: { id: 1, username: 'admin', email: 'a@b.com', fullName: 'Admin User', roles: ['ADMIN'] }
    });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.getToken()).toBe('fake-jwt-token');
    expect(service.hasRole('ADMIN')).toBe(true);
  });

  it('clears session on logout', () => {
    service.login({ username: 'admin', password: 'secret' }).subscribe();
    httpMock
      .expectOne(`${environment.apiBaseUrl}/auth/login`)
      .flush({ token: 't', user: { id: 1, username: 'a', email: 'a@b.com', fullName: 'A', roles: ['CUSTOMER'] } });

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });
});
