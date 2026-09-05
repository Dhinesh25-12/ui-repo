import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Login } from './login';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('Login', () => {
  let authServiceStub: { login: ReturnType<typeof vi.fn> };
  let notificationsStub: { error: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceStub = { login: vi.fn() };
    notificationsStub = { error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
        { provide: NotificationService, useValue: notificationsStub },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } }
      ]
    }).compileComponents();
  });

  it('does not submit when the form is invalid', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    component.submit();
    expect(authServiceStub.login).not.toHaveBeenCalled();
  });

  it('navigates to dashboard on successful login', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    authServiceStub.login.mockReturnValue(of({}));
    component.form.setValue({ username: 'admin', password: 'secret' });
    component.submit();

    expect(authServiceStub.login).toHaveBeenCalledWith({ username: 'admin', password: 'secret' });
    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error notification on failed login', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    authServiceStub.login.mockReturnValue(throwError(() => new Error('invalid')));
    component.form.setValue({ username: 'admin', password: 'wrong' });
    component.submit();

    expect(notificationsStub.error).toHaveBeenCalled();
    expect(component.loading()).toBe(false);
  });
});
