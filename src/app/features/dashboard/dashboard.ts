import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, KpiCard, LoadingSpinner, EmptyState],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  readonly loading = signal(true);
  readonly summary = signal<DashboardSummary | null>(null);
  readonly errored = signal(false);

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: () => {
        this.errored.set(true);
        this.loading.set(false);
      }
    });
  }

  maxRevenue(): number {
    const trend = this.summary()?.revenueTrend ?? [];
    return Math.max(1, ...trend.map((p) => p.revenue));
  }

  maxSplit(): number {
    const split = this.summary()?.policySplit ?? [];
    return Math.max(1, ...split.map((s) => s.count));
  }
}
