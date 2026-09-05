import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CancellationRequestPayload, Policy, PurchasePolicyRequest, RenewalQuote } from '../models/policy.model';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly baseUrl = `${environment.apiBaseUrl}/policies`;

  constructor(private readonly http: HttpClient) {}

  getMyPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.baseUrl}/my`);
  }

  getAll(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.baseUrl);
  }

  getById(id: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.baseUrl}/${id}`);
  }

  purchase(payload: PurchasePolicyRequest): Observable<Policy> {
    return this.http.post<Policy>(this.baseUrl, payload);
  }

  getRenewalQuote(id: number): Observable<RenewalQuote> {
    return this.http.get<RenewalQuote>(`${this.baseUrl}/${id}/renewal-quote`);
  }

  renew(id: number): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/${id}/renew`, {});
  }

  requestCancellation(id: number, payload: CancellationRequestPayload): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/${id}/cancellation-request`, payload);
  }

  getPendingCancellations(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.baseUrl}/cancellation-requests`);
  }

  approveCancellation(id: number): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/${id}/cancellation-approve`, {});
  }

  rejectCancellation(id: number): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/${id}/cancellation-reject`, {});
  }
}
