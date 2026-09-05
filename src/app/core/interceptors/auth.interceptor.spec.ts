import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  function setup(token: string | null) {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { getToken: () => token } },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpMock.verify());

  it('adds an Authorization header when a token is present', () => {
    setup('abc123');
    httpClient.get('/api/policies').subscribe();
    const req = httpMock.expectOne('/api/policies');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ' + 'abc123');
    req.flush({});
  });

  it('does not add an Authorization header when there is no token', () => {
    setup(null);
    httpClient.get('/api/policies').subscribe();
    const req = httpMock.expectOne('/api/policies');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('skips adding the header for login requests', () => {
    setup('abc123');
    httpClient.post('/api/auth/login', {}).subscribe();
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
