import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon }}</div>
      <p class="empty-title">{{ title }}</p>
      <p class="empty-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
    </div>
  `,
  styles: [`
    .empty-state { text-align: center; padding: 2.5rem 1rem; color: #6b7280; }
    .empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .empty-title { font-weight: 600; color: #374151; margin: 0; }
    .empty-subtitle { margin: 0.25rem 0 0; font-size: 0.9rem; }
  `],
  imports: [CommonModule]
})
export class EmptyState {
  @Input() icon = '📭';
  @Input() title = 'No data available';
  @Input() subtitle?: string;
}
