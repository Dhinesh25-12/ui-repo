import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="statusClass()">{{ status }}</span>`,
  styles: [`
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-success { background: #dcfce7; color: #16a34a; }
    .status-warning { background: #fef3c7; color: #b45309; }
    .status-danger { background: #fee2e2; color: #dc2626; }
    .status-info { background: #dbeafe; color: #2563eb; }
    .status-neutral { background: #e5e7eb; color: #374151; }
  `]
})
export class StatusBadge {
  @Input() status = '';

  private readonly successStatuses = ['ACTIVE', 'APPROVED', 'SETTLED', 'SUCCESS'];
  private readonly warningStatuses = ['PENDING', 'UNDER_REVIEW', 'PENDING_CANCELLATION', 'SUBMITTED'];
  private readonly dangerStatuses = ['REJECTED', 'CANCELLED', 'EXPIRED', 'FAILED'];

  statusClass(): string {
    const normalized = (this.status || '').toUpperCase();
    if (this.successStatuses.includes(normalized)) return 'status-success';
    if (this.warningStatuses.includes(normalized)) return 'status-warning';
    if (this.dangerStatuses.includes(normalized)) return 'status-danger';
    return 'status-neutral';
  }
}
