import { Component, OnInit, signal , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { PolicyService } from '../../../core/services/policy.service';
import { Policy } from '../../../core/models/policy.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss'
})
export class PaymentForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);
  readonly policies = signal<Policy[]>([]);

  readonly form = this.fb.nonNullable.group({
    policyId: [0, [Validators.required, Validators.min(1)]],
    amount: [0, [Validators.required, Validators.min(1)]],
    paymentMethod: ['CARD', Validators.required]
  });

  constructor(
    private readonly paymentService: PaymentService,
    private readonly policyService: PolicyService,
    private readonly router: Router,
    private readonly notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.policyService.getMyPolicies().subscribe({
      next: (policies) => this.policies.set(policies),
      error: () => {
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }

  onPolicyChange(policyId: number): void {
    const policy = this.policies().find((p) => p.id === Number(policyId));
    if (policy) {
      this.form.patchValue({ amount: policy.premiumAmount });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.paymentService.pay(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.notifications.success('Payment successful.');
        this.router.navigate(['/payments']);
      },
      error: () => this.submitting.set(false)
    });
  }
}
