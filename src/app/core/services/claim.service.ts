import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Claim, ClaimDecisionAction, FileClaimRequest } from '../models/claim.model';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly baseUrl = `${environment.apiBaseUrl}/claims`;

  constructor(private readonly http: HttpClient) {}

  getMyClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.baseUrl}/me`);
  }

  getQueue(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.baseUrl}/queue`);
  }

  getById(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.baseUrl}/${id}`);
  }

  /**
   * Submits a claim together with its supporting documents as a multipart
   * request so the backend receives the actual file content, not just
   * file metadata.
   */
  fileClaim(payload: FileClaimRequest, files: File[] = []): Observable<Claim> {
    const formData = new FormData();
    formData.append('policyId', String(payload.policyId));
    formData.append('incidentDate', payload.incidentDate);
    formData.append('description', payload.description);
    files.forEach((file) => formData.append('documents', file, file.name));
    return this.http.post<Claim>(this.baseUrl, formData);
  }

  decide(id: number, decision: ClaimDecisionAction, remarks?: string): Observable<Claim> {
    return this.http.put<Claim>(`${this.baseUrl}/${id}/decision`, { decision, remarks });
  }
}
