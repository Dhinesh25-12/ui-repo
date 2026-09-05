import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  function runGuard(isAuthenticated: boolean) {
    const authServiceStub = { isAuthenticated: () => isAuthenticated };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        {
          provide: Router,
          useValue: {
            createUrlTree: (commands: unknown[], extras: unknown) => ({ commands, extras })
          }
        }
      ]
    });

    return TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/dashboard' } as never)
    );
  }

  it('allows navigation when authenticated', () => {
    const result = runGuard(true);
    expect(result).toBe(true);
  });

  it('redirects to login when not authenticated', () => {
    const result = runGuard(false);
    expect(result).not.toBe(true);
    expect((result as unknown as { commands: unknown[] }).commands).toEqual(['/auth/login']);
  });
});
