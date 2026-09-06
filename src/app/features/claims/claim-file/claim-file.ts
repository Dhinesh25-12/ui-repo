import { Component, OnInit, signal , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClaimService } from '../../../core/services/claim.service';
import { PolicyService } from '../../../core/services/policy.service';
import { Policy } from '../../../core/models/policy.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-claim-file',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './claim-file.html',
  styleUrl: './claim-file.scss'
})
export class ClaimFile implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);
  readonly policies = signal<Policy[]>([]);
  readonly selectedFiles = signal<File[]>([]);

  readonly form = this.fb.nonNullable.group({
    policyId: [0, [Validators.required, Validators.min(1)]],
    incidentDate: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor(
    private readonly claimService: ClaimService,
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

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    this.selectedFiles.set(files);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.claimService
      .fileClaim(this.form.getRawValue(), this.selectedFiles())
      .subscribe({
        next: (claim) => {
          this.submitting.set(false);
          this.notifications.success(`Claim ${claim.claimNumber} submitted successfully.`);
          this.router.navigate(['/claims']);
        },
        error: () => this.submitting.set(false)
      });
  }
}
