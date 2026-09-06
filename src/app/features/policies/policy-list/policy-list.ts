import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PolicyService } from '../../../core/services/policy.service';
import { Policy } from '../../../core/models/policy.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinner, EmptyState, StatusBadge],
  templateUrl: './policy-list.html',
  styleUrl: './policy-list.scss'
})
export class PolicyList implements OnInit {
  readonly loading = signal(true);
  readonly policies = signal<Policy[]>([]);

  constructor(
    private readonly policyService: PolicyService,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    const request$ = this.auth.hasRole('CUSTOMER')
      ? this.policyService.getMyPolicies()
      : this.policyService.getAll();

    request$.subscribe({
      next: (policies) => {
        this.policies.set(policies);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
