import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../../../core/services/claim.service';
import { Claim, ClaimStatus } from '../../../core/models/claim.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-claims-queue',
  standalone: true,
  imports: [CommonModule, LoadingSpinner, EmptyState, StatusBadge],
  templateUrl: './claims-queue.html',
  styleUrl: './claims-queue.scss'
})
export class ClaimsQueue implements OnInit {
  readonly loading = signal(true);
  readonly claims = signal<Claim[]>([]);
  readonly statuses: ClaimStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SETTLED'];

  constructor(
    private readonly claimService: ClaimService,
    private readonly notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.claimService.getQueue().subscribe({
      next: (claims) => {
        this.claims.set(claims);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  updateStatus(claim: Claim, status: ClaimStatus): void {
    this.claimService.updateStatus(claim.id, { status }).subscribe(() => {
      this.notifications.success(`Claim ${claim.claimNumber} updated to ${status}.`);
      this.load();
    });
  }
}
