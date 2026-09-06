import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Claim } from '../../../core/models/claim.model';
import { Customer } from '../../../core/models/customer.model';
import { Policy } from '../../../core/models/policy.model';
import { CustomerService } from '../../../core/services/customer.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, EmptyState, LoadingSpinner, StatusBadge],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss'
})
export class CustomerDetail implements OnInit {
  readonly loading = signal(true);
  readonly errored = signal(false);
  readonly customer = signal<Customer | null>(null);
  readonly policies = signal<Policy[]>([]);
  readonly claims = signal<Claim[]>([]);

  private customerId!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errored.set(false);
    forkJoin({
      customer: this.customerService.getById(this.customerId),
      policies: this.customerService.getPolicies(this.customerId, { page: 0, size: 100 }),
      claims: this.customerService.getClaims(this.customerId, { page: 0, size: 100 })
    }).subscribe({
      next: ({ customer, policies, claims }) => {
        this.customer.set(customer);
        this.policies.set(policies.content);
        this.claims.set(claims.content);
        this.loading.set(false);
      },
      error: () => {
        this.errored.set(true);
        this.loading.set(false);
      }
    });
  }

  valueOrDash(value: string | number | null | undefined): string | number {
    return value || '—';
  }
}
