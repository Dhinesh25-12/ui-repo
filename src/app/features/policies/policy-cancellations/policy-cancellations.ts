import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PolicyService } from '../../../core/services/policy.service';
import { Policy } from '../../../core/models/policy.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-policy-cancellations',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinner, EmptyState],
  templateUrl: './policy-cancellations.html',
  styleUrl: './policy-cancellations.scss'
})
export class PolicyCancellations implements OnInit {
  readonly loading = signal(true);
  readonly requests = signal<Policy[]>([]);

  constructor(
    private readonly policyService: PolicyService,
    private readonly notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.policyService.getPendingCancellations().subscribe({
      next: (requests) => {
        this.requests.set(requests);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  approve(id: number): void {
    this.policyService.approveCancellation(id).subscribe({
      next: () => {
        this.notifications.success('Cancellation approved.');
        this.load();
      },
      error: () => {
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }

  reject(id: number): void {
    this.policyService.rejectCancellation(id).subscribe({
      next: () => {
        this.notifications.success('Cancellation rejected.');
        this.load();
      },
      error: () => {
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }
}
