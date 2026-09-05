import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ReportService } from '../../../core/services/report.service';
import {
  ClaimsRatioReport,
  MonthlyRevenuePoint,
  PremiumCollectionReport,
  ProductPerformanceReport,
  TopCustomerReport
} from '../../../core/models/report.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.scss'
})
export class AdminReports implements OnInit {
  readonly loading = signal(true);
  readonly premiumCollection = signal<PremiumCollectionReport[]>([]);
  readonly claimsRatio = signal<ClaimsRatioReport[]>([]);
  readonly productPerformance = signal<ProductPerformanceReport[]>([]);
  readonly monthlyRevenue = signal<MonthlyRevenuePoint[]>([]);
  readonly topCustomers = signal<TopCustomerReport[]>([]);

  constructor(private readonly reportService: ReportService) {}

  ngOnInit(): void {
    forkJoin({
      premiumCollection: this.reportService.getPremiumCollection(),
      claimsRatio: this.reportService.getClaimsRatio(),
      productPerformance: this.reportService.getProductPerformance(),
      monthlyRevenue: this.reportService.getMonthlyRevenue(),
      topCustomers: this.reportService.getTopCustomers()
    }).subscribe({
      next: (result) => {
        this.premiumCollection.set(result.premiumCollection);
        this.claimsRatio.set(result.claimsRatio);
        this.productPerformance.set(result.productPerformance);
        this.monthlyRevenue.set(result.monthlyRevenue);
        this.topCustomers.set(result.topCustomers);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  maxRevenue(): number {
    return Math.max(1, ...this.monthlyRevenue().map((p) => p.revenue));
  }
}
