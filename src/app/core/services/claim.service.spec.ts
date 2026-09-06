import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ClaimService } from './claim.service';
import { environment } from '../../../environments/environment';

describe('ClaimService', () => {
  let service: ClaimService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ClaimService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches the current user claims from the canonical /me endpoint', () => {
    service.getMyClaims().subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/claims/me`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('submits the claim and its files as multipart form data', () => {
    const file = new File(['content'], 'proof.png', { type: 'image/png' });

    service
      .fileClaim({ policyId: 12, incidentDate: '2026-01-01', description: 'Broken windshield' }, [file])
      .subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/claims`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeInstanceOf(FormData);

    const body = req.request.body as FormData;
    expect(body.get('policyId')).toBe('12');
    expect(body.get('incidentDate')).toBe('2026-01-01');
    expect(body.get('description')).toBe('Broken windshield');
    expect(body.get('documents')).toBeInstanceOf(File);
    expect((body.get('documents') as File).name).toBe('proof.png');

    req.flush({ id: 1, claimNumber: 'CLM-1', policyId: 12, incidentDate: '2026-01-01', description: '', status: 'SUBMITTED' });
  });

  it('submits a decision to the canonical PUT decision endpoint', () => {
    service.decide(9, 'APPROVE', 'looks good').subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/claims/9/decision`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ decision: 'APPROVE', remarks: 'looks good' });
    req.flush({ id: 9, claimNumber: 'CLM-9', policyId: 1, incidentDate: '2026-01-01', description: '', status: 'APPROVED' });
  });
});
