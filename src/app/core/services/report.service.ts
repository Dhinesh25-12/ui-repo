import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ClaimsRatioReport,
  CustomerReportSummary,
  MonthlyRevenuePoint,
  PremiumCollectionReport,
  ProductPerformanceReport,
  TopCustomerReport
} from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly baseUrl = `${environment.apiBaseUrl}/reports`;

  constructor(private readonly http: HttpClient) {}

  getCustomerSummary(): Observable<CustomerReportSummary> {
    return this.http.get<CustomerReportSummary>(`${this.baseUrl}/customer/summary`);
  }

  getPremiumCollection(): Observable<PremiumCollectionReport[]> {
    return this.http.get<PremiumCollectionReport[]>(`${this.baseUrl}/admin/premium-collection`);
  }

  getClaimsRatio(): Observable<ClaimsRatioReport[]> {
    return this.http.get<ClaimsRatioReport[]>(`${this.baseUrl}/admin/claims-ratio`);
  }

  getProductPerformance(): Observable<ProductPerformanceReport[]> {
    return this.http.get<ProductPerformanceReport[]>(`${this.baseUrl}/admin/product-performance`);
  }

  getMonthlyRevenue(): Observable<MonthlyRevenuePoint[]> {
    return this.http.get<MonthlyRevenuePoint[]>(`${this.baseUrl}/admin/monthly-revenue`);
  }

  getTopCustomers(): Observable<TopCustomerReport[]> {
    return this.http.get<TopCustomerReport[]>(`${this.baseUrl}/admin/top-customers`);
  }
}
