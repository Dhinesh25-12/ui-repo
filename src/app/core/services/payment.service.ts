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
    return this.http.get<Payment[]>(`${this.baseUrl}/history`);
  }

  pay(payload: PremiumPaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, payload);
  }

  getInvoiceUrl(paymentId: number): string {
    return `${this.baseUrl}/${paymentId}/invoice`;
  }

  getReceiptUrl(paymentId: number): string {
    return `${this.baseUrl}/${paymentId}/receipt`;
  }
}
