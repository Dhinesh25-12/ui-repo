import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardActivity, DashboardSummary } from '../../core/models/dashboard.model';
import { AuthService } from '../../core/services/auth.service';
import { buildConicGradient, DONUT_COLORS, maxOrOne } from '../../shared/utils/chart.util';

const ACTIVITY_ICONS: Record<string, string> = {
  PAYMENT: '💳',
  CLAIM: '🧾',
  POLICY: '📄',
  RENEWAL: '🔄',
  CANCELLATION: '🚫'
};

interface FeatureHighlight {
  icon: string;
  title: string;
  description: string;
}

interface QuickAction {
  icon: string;
  label: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, KpiCard, LoadingSpinner, EmptyState],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  readonly loading = signal(true);
  readonly summary = signal<DashboardSummary | null>(null);
  readonly errored = signal(false);
  readonly donutColors = DONUT_COLORS;

  readonly quickActions: QuickAction[] = [
    { icon: '🛒', label: 'Buy Policy', link: '/products' },
    { icon: '🧾', label: 'File Claims', link: '/claims/new' },
    { icon: '💳', label: 'Make Payments', link: '/payments/pay' },
    { icon: '📍', label: 'Track Status', link: '/claims' }
  ];

  readonly featureHighlights: FeatureHighlight[] = [
    { icon: '🛡️', title: 'Secure & Reliable', description: 'Bank-grade encryption keeps your data and payments safe.' },
    { icon: '⚡', title: 'Easy & Simple', description: 'Buy, renew, and manage policies in just a few clicks.' },
    { icon: '🕑', title: '24/7 Support', description: 'Our support team is always available to help you.' },
    { icon: '📊', title: 'Smart Insights', description: 'Track your policies, claims, and payments in one place.' }
  ];

  constructor(
    private readonly dashboardService: DashboardService,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errored.set(false);
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
    return maxOrOne(trend.map((p) => p.revenue));
  }

  totalSplit(): number {
    const split = this.summary()?.policySplit ?? [];
    return split.reduce((sum, item) => sum + item.count, 0);
  }

  donutGradient(): string {
    const split = this.summary()?.policySplit ?? [];
    return buildConicGradient(split.map((item) => item.count), this.donutColors);
  }

  sliceColor(index: number): string {
    return this.donutColors[index % this.donutColors.length];
  }

  activityIcon(activity: DashboardActivity): string {
    return ACTIVITY_ICONS[activity.type ?? ''] ?? '🔔';
  }

  activityTitle(activity: DashboardActivity): string {
    return activity.title ?? activity.message ?? 'Activity';
  }

  activityDescription(activity: DashboardActivity): string | undefined {
    return activity.description ?? (activity.title ? activity.message : undefined);
  }

  activityAmountLabel(activity: DashboardActivity): string | undefined {
    if (activity.referenceNumber) {
      return activity.referenceNumber;
    }
    if (activity.amount !== undefined && activity.amount !== null) {
      return '₹' + activity.amount;
    }
    return undefined;
  }
}
