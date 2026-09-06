import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { UpdateProfileRequest } from '../../core/models/user.model';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';

/** Mirrors the backend rule that a date of birth may not be in the future. */
export function notInFuture(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) {
    return null;
  }
  const today = new Date().toISOString().slice(0, 10);
  return value > today ? { futureDate: true } : null;
}

/** Client-side only check that the confirmation matches the new password. */
export function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinner],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly notifications = inject(NotificationService);
  readonly auth = inject(AuthService);

  readonly loading = signal(true);
  readonly loadFailed = signal(false);
  readonly saving = signal(false);
  readonly changingPassword = signal(false);
  readonly currentPasswordError = signal<string | null>(null);

  readonly profile = signal(this.auth.currentUser());
  /** KYC details are only meaningful for customers; the backend ignores them for other roles. */
  readonly isCustomer = computed(() => (this.profile()?.roles ?? []).includes('CUSTOMER'));

  readonly kycIdTypes = ['AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID'];

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    address: [''],
    city: [''],
    state: [''],
    postalCode: [''],
    dateOfBirth: ['', notInFuture],
    kycIdType: ['', Validators.maxLength(50)],
    kycIdNumber: ['', Validators.maxLength(100)]
  });

  readonly passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordsMatch }
  );

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.profile.set(user);
        this.form.patchValue({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          phone: user.phone ?? '',
          address: user.address ?? '',
          city: user.city ?? '',
          state: user.state ?? '',
          postalCode: user.postalCode ?? '',
          dateOfBirth: user.dateOfBirth ?? '',
          kycIdType: user.kycIdType ?? '',
          kycIdNumber: user.kycIdNumber ?? ''
        });
        this.loading.set(false);
      },
      error: () => {
        this.loadFailed.set(true);
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.userService.updateProfile(this.buildPayload()).subscribe({
      next: (user) => {
        this.profile.set(user);
        this.saving.set(false);
        this.notifications.success('Profile updated successfully.');
      },
      error: () => this.saving.set(false)
    });
  }

  changePassword(): void {
    this.currentPasswordError.set(null);
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.changingPassword.set(true);
    this.userService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.changingPassword.set(false);
        this.passwordForm.reset();
        this.notifications.success('Password changed successfully.');
      },
      error: (error: HttpErrorResponse) => {
        this.changingPassword.set(false);
        const message = this.backendMessage(error);
        if (error.status === 400 && message && /current password/i.test(message)) {
          this.currentPasswordError.set(message);
        }
      }
    });
  }

  /**
   * Sends cleared text fields as empty strings so a value can be removed, but
   * omits a blank date of birth (and the whole KYC block for non-customers)
   * because the backend cannot parse an empty date.
   */
  private buildPayload(): UpdateProfileRequest {
    const raw = this.form.getRawValue();
    const payload: UpdateProfileRequest = {
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      phone: raw.phone.trim(),
      address: raw.address.trim(),
      city: raw.city.trim(),
      state: raw.state.trim(),
      postalCode: raw.postalCode.trim()
    };

    if (this.isCustomer()) {
      payload.kycIdType = raw.kycIdType.trim();
      payload.kycIdNumber = raw.kycIdNumber.trim();
      if (raw.dateOfBirth) {
        payload.dateOfBirth = raw.dateOfBirth;
      }
    }

    return payload;
  }

  /** Reads the backend message the same way the global error interceptor does. */
  private backendMessage(error: HttpErrorResponse): string | null {
    const body = error.error;
    if (typeof body === 'string' && body.trim().length > 0) {
      return body;
    }
    if (body && typeof body === 'object' && typeof body.message === 'string') {
      return body.message;
    }
    return null;
  }
}
