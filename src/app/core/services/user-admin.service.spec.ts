import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserAdminService } from './user-admin.service';
import { environment } from '../../../environments/environment';

describe('UserAdminService', () => {
  let service: UserAdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches all users and unwraps the paginated response', () => {
    let result: unknown;
    service.getAll().subscribe((users) => (result = users));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/admin/users`);
    expect(req.request.method).toBe('GET');
    const user = { id: 1, username: 'maya', roles: ['CUSTOMER'] };
    req.flush({ content: [user], totalElements: 1, totalPages: 1, size: 20, number: 0, first: true, last: true });

    expect(result).toEqual([user]);
  });

  it('updates a user roles', () => {
    service.updateRoles(1, ['ADMIN']).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/admin/users/1/roles`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ roles: ['ADMIN'] });
    req.flush({ id: 1, username: 'maya', roles: ['ADMIN'] });
  });

  it('updates a user enabled status', () => {
    service.setEnabled(1, false).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/admin/users/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ enabled: false });
    req.flush({ id: 1, username: 'maya', roles: ['CUSTOMER'], enabled: false });
  });
});
