import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserRole } from '../../core/models/user.model';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: UserRole[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {
  readonly sidebarOpen = signal(true);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Products', path: '/products', icon: '🛍️' },
    { label: 'Policies', path: '/policies', icon: '📄' },
    { label: 'Claims', path: '/claims', icon: '🧾' },
    { label: 'Payments', path: '/payments', icon: '💳' },
    { label: 'Reports', path: '/reports', icon: '📈' },
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'User Management', path: '/admin/users', icon: '⚙️', roles: ['ADMIN'] }
  ];

  constructor(
    readonly auth: AuthService,
    private readonly router: Router,
    private readonly notifications: NotificationService
  ) {}

  visibleNavItems(): NavItem[] {
    return this.navItems.filter((item) => !item.roles || this.auth.hasAnyRole(item.roles));
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  logout(): void {
    this.auth.logout();
    this.notifications.info('You have been logged out.');
    this.router.navigate(['/auth/login']);
  }
}
