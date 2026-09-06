import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../core/services/report.service';
import { CustomerReportSummary } from '../../../core/models/report.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { KpiCard } from '../../../shared/components/kpi-card/kpi-card';

@Component({
  selector: 'app-customer-reports',
  standalone: true,
  imports: [CommonModule, LoadingSpinner, KpiCard],
  templateUrl: './customer-reports.html',
  styleUrl: './customer-reports.scss'
})
export class CustomerReports implements OnInit {
  readonly loading = signal(true);
  readonly summary = signal<CustomerReportSummary | null>(null);

  constructor(private readonly reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getCustomerSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
