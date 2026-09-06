import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Claim } from '../models/claim.model';
import { Customer, PageResponse } from '../models/customer.model';
import { Policy } from '../models/policy.model';

export interface CustomerListParams {
  page?: number;
  size?: number;
  query?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = `${environment.apiBaseUrl}/customers`;

  constructor(private readonly http: HttpClient) {}

  getCustomers(params: CustomerListParams = {}): Observable<PageResponse<Customer>> {
    return this.http.get<PageResponse<Customer>>(this.baseUrl, { params: this.toHttpParams(params) });
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  getPolicies(id: number, params: Pick<CustomerListParams, 'page' | 'size'> = {}): Observable<PageResponse<Policy>> {
    return this.http.get<PageResponse<Policy>>(`${this.baseUrl}/${id}/policies`, {
      params: this.toHttpParams(params)
    });
  }

  getClaims(id: number, params: Pick<CustomerListParams, 'page' | 'size'> = {}): Observable<PageResponse<Claim>> {
    return this.http.get<PageResponse<Claim>>(`${this.baseUrl}/${id}/claims`, {
      params: this.toHttpParams(params)
    });
  }

  private toHttpParams(params: CustomerListParams): HttpParams {
    let httpParams = new HttpParams();
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size);
    }
    if (params.query?.trim()) {
      httpParams = httpParams.set('query', params.query.trim());
    }
    return httpParams;
  }
}
