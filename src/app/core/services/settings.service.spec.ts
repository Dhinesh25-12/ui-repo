import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { environment } from '../../../environments/environment';

describe('SettingsService', () => {
  let service: SettingsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads the platform settings list', () => {
    service.getSettings().subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/admin/settings`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('updates a setting by key', () => {
    service.updateSetting('policies.default-tenure-months-override', '24').subscribe();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/admin/settings/policies.default-tenure-months-override`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ value: '24' });
    req.flush({ key: 'policies.default-tenure-months-override', value: '24', editable: true });
  });
});
