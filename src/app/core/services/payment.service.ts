import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Payment, PremiumPaymentRequest } from '../models/payment.model';
import { PageResponse } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/payments`;

  constructor(private readonly http: HttpClient) {}

  /** Backend returns a paginated `Page<PaymentResponse>`; unwrap to the flat list the UI needs. */
  getHistory(): Observable<Payment[]> {
    return this.http.get<PageResponse<Payment>>(`${this.baseUrl}/me`).pipe(map((page) => page.content));
  }

  pay(payload: PremiumPaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, payload);
  }

  /**
   * Downloads the invoice as a blob via HttpClient so the auth interceptor
   * attaches the bearer token. A plain `<a href>` would bypass the
   * interceptor and 401 against this JWT-protected endpoint.
   */
  downloadInvoice(paymentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${paymentId}/invoice`, { responseType: 'blob' });
  }

  downloadReceipt(paymentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${paymentId}/receipt`, { responseType: 'blob' });
  }
}
