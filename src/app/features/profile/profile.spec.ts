import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Profile } from './profile';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthUser } from '../../core/models/user.model';

describe('Profile', () => {
  let userServiceStub: {
    getProfile: ReturnType<typeof vi.fn>;
    updateProfile: ReturnType<typeof vi.fn>;
    changePassword: ReturnType<typeof vi.fn>;
  };
  let notificationsStub: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  const customer: AuthUser = {
    id: 1,
    username: 'jane',
    email: 'jane@example.com',
    fullName: 'Jane Doe',
    roles: ['CUSTOMER'],
    firstName: 'Jane',
    lastName: 'Doe',
    city: 'Pune',
    kycIdType: 'PAN'
  };

  beforeEach(async () => {
    userServiceStub = {
      getProfile: vi.fn().mockReturnValue(of(customer)),
      updateProfile: vi.fn().mockReturnValue(of(customer)),
      changePassword: vi.fn().mockReturnValue(of(undefined))
    };
    notificationsStub = { success: vi.fn(), error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: NotificationService, useValue: notificationsStub },
        { provide: AuthService, useValue: { currentUser: () => customer } }
      ]
    }).compileComponents();
  });

  function createComponent(): Profile {
    const fixture = TestBed.createComponent(Profile);
    fixture.componentInstance.ngOnInit();
    return fixture.componentInstance;
  }

  it('loads the profile from the API and patches the form', () => {
    const component = createComponent();

    expect(userServiceStub.getProfile).toHaveBeenCalled();
    expect(component.loading()).toBe(false);
    expect(component.form.value.firstName).toBe('Jane');
    expect(component.form.value.city).toBe('Pune');
    expect(component.isCustomer()).toBe(true);
  });

  it('does not submit an invalid profile form', () => {
    const component = createComponent();
    component.form.patchValue({ firstName: '' });
    component.submit();
    expect(userServiceStub.updateProfile).not.toHaveBeenCalled();
  });

  it('rejects a date of birth in the future', () => {
    const component = createComponent();
    const future = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
    component.form.patchValue({ dateOfBirth: future });
    expect(component.form.get('dateOfBirth')?.hasError('futureDate')).toBe(true);
  });

  it('omits blank optional fields when saving', () => {
    const component = createComponent();
    component.submit();

    expect(userServiceStub.updateProfile).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Doe',
      city: 'Pune',
      kycIdType: 'PAN'
    });
    expect(notificationsStub.success).toHaveBeenCalled();
    expect(component.saving()).toBe(false);
  });

  it('requires the new password and its confirmation to match', () => {
    const component = createComponent();
    component.passwordForm.setValue({
      currentPassword: 'old-secret',
      newPassword: 'new-secret',
      confirmPassword: 'different'
    });
    component.changePassword();

    expect(component.passwordForm.hasError('passwordMismatch')).toBe(true);
    expect(userServiceStub.changePassword).not.toHaveBeenCalled();
  });

  it('changes the password and clears the form on success', () => {
    const component = createComponent();
    component.passwordForm.setValue({
      currentPassword: 'old-secret',
      newPassword: 'new-secret',
      confirmPassword: 'new-secret'
    });
    component.changePassword();

    expect(userServiceStub.changePassword).toHaveBeenCalledWith({
      currentPassword: 'old-secret',
      newPassword: 'new-secret'
    });
    expect(notificationsStub.success).toHaveBeenCalled();
    expect(component.passwordForm.value.newPassword).toBeFalsy();
  });

  it('surfaces an incorrect current password inline', () => {
    const component = createComponent();
    userServiceStub.changePassword.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({ status: 400, error: { message: 'Current password is incorrect' } })
      )
    );
    component.passwordForm.setValue({
      currentPassword: 'wrong',
      newPassword: 'new-secret',
      confirmPassword: 'new-secret'
    });
    component.changePassword();

    expect(component.currentPasswordError()).toBe('Current password is incorrect');
    expect(component.changingPassword()).toBe(false);
  });
});
