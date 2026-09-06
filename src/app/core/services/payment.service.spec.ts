import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PaymentService } from './payment.service';
import { environment } from '../../../environments/environment';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches payment history from the canonical /me endpoint and unwraps the page', () => {
    let result: unknown;
    service.getHistory().subscribe((payments) => (result = payments));
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/payments/me`);
    expect(req.request.method).toBe('GET');
    const payment = { id: 1, policyId: 1, amount: 100, paymentDate: '2026-01-01', status: 'SUCCESS' };
    req.flush({ content: [payment], totalElements: 1, totalPages: 1, size: 20, number: 0, first: true, last: true });

    expect(result).toEqual([payment]);
  });

  it('downloads the invoice as a blob via HttpClient', () => {
    let result: Blob | undefined;
    service.downloadInvoice(42).subscribe((blob) => (result = blob));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/payments/42/invoice`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    const blob = new Blob(['pdf-bytes']);
    req.flush(blob);

    expect(result).toBe(blob);
  });

  it('downloads the receipt as a blob via HttpClient', () => {
    service.downloadReceipt(7).subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/payments/7/receipt`);
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['pdf-bytes']));
  });
});
