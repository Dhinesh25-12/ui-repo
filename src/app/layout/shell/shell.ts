import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserRole } from '../../core/models/user.model';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: UserRole[];
}

const ALL_ROLES: UserRole[] = ['CUSTOMER', 'AGENT', 'CLAIMS_OFFICER', 'ADMIN'];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  readonly auth = inject(AuthService);

  readonly sidebarOpen = signal(true);
  readonly userMenuOpen = signal(false);
  readonly notificationsOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊', roles: ALL_ROLES },
    { label: 'Policies', path: '/policies', icon: '📄', roles: ['CUSTOMER', 'AGENT', 'ADMIN'] },
    { label: 'Claims', path: '/claims', icon: '🧾', roles: ['CUSTOMER', 'CLAIMS_OFFICER', 'ADMIN'] },
    { label: 'Payments', path: '/payments', icon: '💳', roles: ['CUSTOMER', 'ADMIN'] },
    { label: 'My Profile', path: '/profile', icon: '👤', roles: ALL_ROLES },
    { label: 'Reports', path: '/reports', icon: '📈', roles: ['CUSTOMER', 'ADMIN'] },
    { label: 'Messages', path: '/messages', icon: '✉️', roles: ALL_ROLES },
    { label: 'Support', path: '/support', icon: '🆘', roles: ALL_ROLES },
    { label: 'User Management', path: '/admin/users', icon: '⚙️', roles: ['ADMIN'] }
  ];

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
    { initialValue: null }
  );

  readonly pageTitle = computed(() => {
    this.navigationEnd();
    const url = this.router.url;
    const match = this.navItems
      .filter((item) => url === item.path || url.startsWith(item.path + '/'))
      .sort((a, b) => b.path.length - a.path.length)[0];
    return match?.label ?? 'Dashboard';
  });

  readonly unreadCount = computed(() => this.notifications.unreadCount());

  visibleNavItems(): NavItem[] {
    return this.navItems.filter((item) => !item.roles || this.auth.hasAnyRole(item.roles));
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((open) => !open);
  }

  toggleNotifications(): void {
    const wasOpen = this.notificationsOpen();
    this.notificationsOpen.update((open) => !open);
    // Mark as read when the panel is closed, so the badge stays visible
    // while the user is actually looking at the list.
    if (wasOpen) {
      this.notifications.markAllRead();
    }
  }

  logout(): void {
    this.auth.logout();
    this.notifications.info('You have been logged out.');
    this.router.navigate(['/auth/login']);
  }
}
