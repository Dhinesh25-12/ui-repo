import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CustomerService } from './customer.service';
import { environment } from '../../../environments/environment';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches paged customers with optional search query', () => {
    service.getCustomers({ page: 2, size: 25, query: 'maya' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/customers?page=2&size=25&query=maya`);
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 25, number: 2, first: false, last: true });
  });

  it('fetches customer detail', () => {
    service.getById(7).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/customers/7`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 7, username: 'maya', email: 'maya@example.com', fullName: 'Maya Rao', active: true, policyCount: 0 });
  });

  it('fetches a customer policies page', () => {
    service.getPolicies(7, { page: 1, size: 10 }).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/customers/7/policies?page=1&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 1, first: false, last: true });
  });

  it('fetches a customer claims page', () => {
    service.getClaims(7, { page: 1, size: 10 }).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/customers/7/claims?page=1&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 1, first: false, last: true });
  });
});
