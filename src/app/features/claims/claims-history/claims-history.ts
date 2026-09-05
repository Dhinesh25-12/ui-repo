import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClaimService } from '../../../core/services/claim.service';
import { Claim } from '../../../core/models/claim.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

const STATUS_STEPS = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'SETTLED'];

@Component({
  selector: 'app-claims-history',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinner, EmptyState, StatusBadge],
  templateUrl: './claims-history.html',
  styleUrl: './claims-history.scss'
})
export class ClaimsHistory implements OnInit {
  readonly loading = signal(true);
  readonly claims = signal<Claim[]>([]);
  readonly steps = STATUS_STEPS;

  constructor(private readonly claimService: ClaimService) {}

  ngOnInit(): void {
    this.claimService.getMyClaims().subscribe({
      next: (claims) => {
        this.claims.set(claims);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  stepIndex(claim: Claim): number {
    if (claim.status === 'REJECTED') return -1;
    return this.steps.indexOf(claim.status);
  }
}
