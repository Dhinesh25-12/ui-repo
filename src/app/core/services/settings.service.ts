import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlatformSetting } from '../models/setting.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly baseUrl = `${environment.apiBaseUrl}/admin/settings`;

  constructor(private readonly http: HttpClient) {}

  getSettings(): Observable<PlatformSetting[]> {
    return this.http.get<PlatformSetting[]>(this.baseUrl);
  }

  updateSetting(key: string, value: string): Observable<PlatformSetting> {
    return this.http.put<PlatformSetting>(`${this.baseUrl}/${encodeURIComponent(key)}`, { value });
  }
}
