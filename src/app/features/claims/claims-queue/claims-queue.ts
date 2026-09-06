import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../../../core/services/claim.service';
import { Claim, ClaimStatus } from '../../../core/models/claim.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { NotificationService } from '../../../core/services/notification.service';

const TERMINAL_STATUSES: ClaimStatus[] = ['APPROVED', 'REJECTED', 'SETTLED'];

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
  readonly decidingId = signal<number | null>(null);

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

  startReview(claim: Claim): void {
    this.decidingId.set(claim.id);
    this.claimService.updateStatus(claim.id, 'UNDER_REVIEW').subscribe({
      next: (updated) => {
        this.decidingId.set(null);
        this.claims.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
        this.notifications.success(`Claim ${claim.claimNumber} moved to review.`);
      },
      error: () => {
        this.decidingId.set(null);
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }

  approve(claim: Claim): void {
    this.decide(claim, 'APPROVE');
  }

  reject(claim: Claim): void {
    this.decide(claim, 'REJECT');
  }

  /** Claims must be moved to UNDER_REVIEW (via startReview) before they can be approved. */
  canStartReview(claim: Claim): boolean {
    return this.decidingId() === null && claim.status === 'SUBMITTED';
  }

  canApprove(claim: Claim): boolean {
    return this.decidingId() === null && claim.status === 'UNDER_REVIEW';
  }

  canReject(claim: Claim): boolean {
    return this.decidingId() === null && !TERMINAL_STATUSES.includes(claim.status);
  }

  private decide(claim: Claim, decision: 'APPROVE' | 'REJECT'): void {
    this.decidingId.set(claim.id);
    this.claimService.decide(claim.id, decision).subscribe({
      next: (updated) => {
        this.decidingId.set(null);
        this.claims.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
        this.notifications.success(
          `Claim ${claim.claimNumber} ${decision === 'APPROVE' ? 'approved' : 'rejected'}.`
        );
      },
      error: () => {
        this.decidingId.set(null);
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }
}
