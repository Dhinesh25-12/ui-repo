import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PolicyService } from '../../../core/services/policy.service';
import { Policy, RenewalQuote } from '../../../core/models/policy.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinner, StatusBadge],
  templateUrl: './policy-detail.html',
  styleUrl: './policy-detail.scss'
})
export class PolicyDetail implements OnInit {
  readonly loading = signal(true);
  readonly policy = signal<Policy | null>(null);
  readonly renewalQuote = signal<RenewalQuote | null>(null);
  readonly showCancelForm = signal(false);
  cancelReason = '';

  private policyId!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly policyService: PolicyService,
    private readonly notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.policyId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.policyService.getById(this.policyId).subscribe({
      next: (policy) => {
        this.policy.set(policy);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  fetchRenewalQuote(): void {
    this.policyService.getRenewalQuote(this.policyId).subscribe({
      next: (quote) => this.renewalQuote.set(quote),
      error: () => {
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }

  renew(): void {
    this.policyService.renew(this.policyId).subscribe({
      next: () => {
        this.notifications.success('Policy renewed successfully.');
        this.renewalQuote.set(null);
        this.load();
      },
      error: () => {
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }

  requestCancellation(): void {
    if (!this.cancelReason.trim()) {
      this.notifications.error('Please provide a reason for cancellation.');
      return;
    }
    this.policyService.requestCancellation(this.policyId, { reason: this.cancelReason }).subscribe({
      next: () => {
        this.notifications.success('Cancellation request submitted.');
        this.showCancelForm.set(false);
        this.load();
      },
      error: () => {
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }
}
