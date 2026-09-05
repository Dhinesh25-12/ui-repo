import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment, PaymentStatus } from '../../../core/models/payment.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

type SortKey = 'paymentDate' | 'amount';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinner, EmptyState, StatusBadge],
  templateUrl: './payment-history.html',
  styleUrl: './payment-history.scss'
})
export class PaymentHistory implements OnInit {
  readonly loading = signal(true);
  readonly payments = signal<Payment[]>([]);
  readonly statusFilter = signal<PaymentStatus | ''>('');
  readonly sortKey = signal<SortKey>('paymentDate');
  readonly sortAsc = signal(false);

  readonly filteredPayments = computed(() => {
    let list = this.payments();
    const status = this.statusFilter();
    if (status) {
      list = list.filter((p) => p.status === status);
    }
    const key = this.sortKey();
    const asc = this.sortAsc();
    return [...list].sort((a, b) => {
      const cmp = key === 'amount' ? a.amount - b.amount : a.paymentDate.localeCompare(b.paymentDate);
      return asc ? cmp : -cmp;
    });
  });

  constructor(private readonly paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.getHistory().subscribe({
      next: (payments) => {
        this.payments.set(payments);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortAsc.update((asc) => !asc);
    } else {
      this.sortKey.set(key);
      this.sortAsc.set(false);
    }
  }

  invoiceUrl(paymentId: number): string {
    return this.paymentService.getInvoiceUrl(paymentId);
  }

  receiptUrl(paymentId: number): string {
    return this.paymentService.getReceiptUrl(paymentId);
  }
}
