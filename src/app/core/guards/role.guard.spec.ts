import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  function runGuard(options: { authenticated: boolean; roles: string[] }, allowed: string[]) {
    const authServiceStub = {
      isAuthenticated: () => options.authenticated,
      hasAnyRole: (allowedRoles: string[]) => allowedRoles.some((r) => options.roles.includes(r))
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        {
          provide: Router,
          useValue: {
            createUrlTree: (commands: unknown[]) => ({ commands })
          }
        }
      ]
    });

    const guard = roleGuard(allowed as never);
    return TestBed.runInInjectionContext(() => guard({} as never, {} as never));
  }

  it('allows access when user has an allowed role', () => {
    const result = runGuard({ authenticated: true, roles: ['ADMIN'] }, ['ADMIN']);
    expect(result).toBe(true);
  });

  it('redirects to forbidden when role does not match', () => {
    const result = runGuard({ authenticated: true, roles: ['CUSTOMER'] }, ['ADMIN']);
    expect(result).not.toBe(true);
    expect((result as unknown as { commands: unknown[] }).commands).toEqual(['/forbidden']);
  });

  it('redirects to login when not authenticated', () => {
    const result = runGuard({ authenticated: false, roles: [] }, ['ADMIN']);
    expect((result as unknown as { commands: unknown[] }).commands).toEqual(['/auth/login']);
  });
});
