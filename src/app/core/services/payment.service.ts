import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, PremiumPaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/payments`;

  constructor(private readonly http: HttpClient) {}

  getHistory(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/me`);
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
