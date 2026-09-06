import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  /**
   * Persistent count of notifications the user hasn't seen yet, independent
   * of the transient toast pop-ups (which auto-dismiss after a few seconds).
   * Used to drive the notification bell's unread badge.
   */
  readonly unreadCount = signal(0);

  success(message: string): void {
    this.push(message, 'success');
  }

  error(message: string): void {
    this.push(message, 'error');
  }

  info(message: string): void {
    this.push(message, 'info');
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  markAllRead(): void {
    this.unreadCount.set(0);
  }

  private push(message: string, type: Toast['type']): void {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toasts.update((list) => [...list, toast]);
    this.unreadCount.update((count) => count + 1);
    setTimeout(() => this.dismiss(toast.id), 5000);
  }
}
