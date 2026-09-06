import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/customer.model';
import { CancellationRequestPayload, Policy, PurchasePolicyRequest, RenewalQuote } from '../models/policy.model';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly baseUrl = `${environment.apiBaseUrl}/policies`;

  constructor(private readonly http: HttpClient) {}

  /** Backend returns a paginated `Page<PolicyResponse>`; unwrap to the flat list the UI needs. */
  getMyPolicies(): Observable<Policy[]> {
    return this.http
      .get<PageResponse<Policy>>(`${this.baseUrl}/me`)
      .pipe(map((page) => page.content));
  }

  getAll(): Observable<Policy[]> {
    return this.http.get<PageResponse<Policy>>(this.baseUrl).pipe(map((page) => page.content));
  }

  getById(id: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.baseUrl}/${id}`);
  }

  purchase(payload: PurchasePolicyRequest): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/purchase`, payload);
  }

  getRenewalQuote(id: number): Observable<RenewalQuote> {
    return this.http.get<RenewalQuote>(`${this.baseUrl}/${id}/renewal-quote`);
  }

  renew(id: number): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/${id}/renew`, {});
  }

  requestCancellation(id: number, payload: CancellationRequestPayload): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/${id}/cancel`, payload);
  }

  getPendingCancellations(): Observable<Policy[]> {
    return this.http
      .get<PageResponse<Policy>>(`${this.baseUrl}/cancellation-requests`)
      .pipe(map((page) => page.content));
  }

  approveCancellation(id: number): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/${id}/cancel/approve`, {});
  }

  rejectCancellation(id: number): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/${id}/cancellation-reject`, {});
  }
}
