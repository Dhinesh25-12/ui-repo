import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PolicyService } from './policy.service';
import { environment } from '../../../environments/environment';

describe('PolicyService', () => {
  let service: PolicyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PolicyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches the current user policies from /me and unwraps the paginated response', () => {
    let result: unknown;
    service.getMyPolicies().subscribe((policies) => (result = policies));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/policies/me`);
    expect(req.request.method).toBe('GET');
    const policy = { id: 1, policyNumber: 'POL-1', status: 'ACTIVE' };
    req.flush({ content: [policy], totalElements: 1, totalPages: 1, size: 20, number: 0, first: true, last: true });

    expect(result).toEqual([policy]);
  });

  it('fetches all policies and unwraps the paginated response', () => {
    let result: unknown;
    service.getAll().subscribe((policies) => (result = policies));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/policies`);
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 0, first: true, last: true });

    expect(result).toEqual([]);
  });

  it('posts a flat purchase body matching the backend request shape', () => {
    service
      .purchase({
        productId: 5,
        nomineeName: 'Jane Doe',
        nomineeRelationship: 'Spouse',
        nomineeContact: '9876543210'
      })
      .subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/policies/purchase`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      productId: 5,
      nomineeName: 'Jane Doe',
      nomineeRelationship: 'Spouse',
      nomineeContact: '9876543210'
    });
    req.flush({ id: 1, policyNumber: 'POL-1', nomineeName: 'Jane Doe' });
  });

  it('fetches pending cancellation requests and unwraps the paginated response', () => {
    let result: unknown;
    service.getPendingCancellations().subscribe((policies) => (result = policies));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/policies/cancellation-requests`);
    expect(req.request.method).toBe('GET');
    const policy = { id: 2, policyNumber: 'POL-2', status: 'CANCELLATION_REQUESTED' };
    req.flush({ content: [policy], totalElements: 1, totalPages: 1, size: 20, number: 0, first: true, last: true });

    expect(result).toEqual([policy]);
  });
});
