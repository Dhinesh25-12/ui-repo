import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmptyState, LoadingSpinner, StatusBadge],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss'
})
export class CustomerList implements OnInit {
  readonly loading = signal(true);
  readonly errored = signal(false);
  readonly customers = signal<Customer[]>([]);
  readonly page = signal(0);
  readonly size = 10;
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly searchControl = new FormControl('', { nonNullable: true });

  private readonly destroyRef = inject(DestroyRef);
  private readonly searchChanges = new Subject<string>();

  constructor(
    private readonly customerService: CustomerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.searchChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.page.set(0);
        this.load();
      });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errored.set(false);
    this.customerService
      .getCustomers({ page: this.page(), size: this.size, query: this.searchControl.value })
      .subscribe({
        next: (page) => {
          this.customers.set(page.content);
          this.totalElements.set(page.totalElements);
          this.totalPages.set(page.totalPages);
          this.page.set(page.number);
          this.loading.set(false);
        },
        error: () => {
          this.errored.set(true);
          this.loading.set(false);
        }
      });
  }

  search(): void {
    this.searchChanges.next(this.searchControl.value);
  }

  previousPage(): void {
    if (this.page() === 0) {
      return;
    }
    this.page.update((page) => page - 1);
    this.load();
  }

  nextPage(): void {
    if (this.page() >= this.totalPages() - 1) {
      return;
    }
    this.page.update((page) => page + 1);
    this.load();
  }

  viewCustomer(customer: Customer): void {
    this.router.navigate(['/customers', customer.id]);
  }
}
