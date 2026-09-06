import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAdminService } from '../../../core/services/user-admin.service';
import { AuthUser, UserRole } from '../../../core/models/user.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, LoadingSpinner, EmptyState],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagement implements OnInit {
  readonly loading = signal(true);
  readonly users = signal<AuthUser[]>([]);
  readonly allRoles: UserRole[] = ['CUSTOMER', 'AGENT', 'CLAIMS_OFFICER', 'ADMIN'];

  constructor(
    private readonly userAdminService: UserAdminService,
    private readonly notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.userAdminService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleRole(user: AuthUser, role: UserRole): void {
    const hasRole = user.roles.includes(role);
    const roles = hasRole ? user.roles.filter((r) => r !== role) : [...user.roles, role];
    this.userAdminService.updateRoles(user.id, roles).subscribe({
      next: (updated) => {
        this.users.update((current) => current.map((u) => (u.id === updated.id ? updated : u)));
        this.notifications.success(`Updated roles for ${user.username}.`);
      },
      error: () => {
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }

  toggleEnabled(user: AuthUser): void {
    const enabled = !(user.enabled ?? true);
    this.userAdminService.setEnabled(user.id, enabled).subscribe({
      next: (updated) => {
        this.users.update((current) => current.map((u) => (u.id === updated.id ? updated : u)));
        this.notifications.success(`${user.username} is now ${enabled ? 'active' : 'suspended'}.`);
      },
      error: () => {
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }
}
