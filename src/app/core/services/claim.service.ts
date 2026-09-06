import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Claim, ClaimStatusUpdateRequest, FileClaimRequest } from '../models/claim.model';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly baseUrl = `${environment.apiBaseUrl}/claims`;

  constructor(private readonly http: HttpClient) {}

  getMyClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.baseUrl}/my`);
  }

  getQueue(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.baseUrl}/queue`);
  }

  getById(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.baseUrl}/${id}`);
  }

  fileClaim(payload: FileClaimRequest): Observable<Claim> {
    return this.http.post<Claim>(this.baseUrl, payload);
  }

  updateStatus(id: number, payload: ClaimStatusUpdateRequest): Observable<Claim> {
    return this.http.patch<Claim>(`${this.baseUrl}/${id}/status`, payload);
  }
}
