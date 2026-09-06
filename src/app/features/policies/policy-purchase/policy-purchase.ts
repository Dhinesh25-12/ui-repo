import { Component, OnInit, signal , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { PolicyService } from '../../../core/services/policy.service';
import { Product } from '../../../core/models/product.model';
import { Policy, PurchasePolicyRequest } from '../../../core/models/policy.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-policy-purchase',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinner],
  templateUrl: './policy-purchase.html',
  styleUrl: './policy-purchase.scss'
})
export class PolicyPurchase implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly loadingProducts = signal(true);
  readonly submitting = signal(false);
  readonly confirmedPolicy = signal<Policy | null>(null);
  readonly products = signal<Product[]>([]);

  readonly form = this.fb.nonNullable.group({
    productId: [0, [Validators.required, Validators.min(1)]],
    nominee: this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.pattern(/\S/)]],
      relationship: ['', [Validators.required, Validators.pattern(/\S/)]],
      contactNumber: ['']
    })
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly policyService: PolicyService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loadingProducts.set(false);
        const preselect = Number(this.route.snapshot.queryParamMap.get('productId'));
        if (preselect) {
          this.form.patchValue({ productId: preselect });
        }
      },
      error: () => this.loadingProducts.set(false)
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.policyService.purchase(this.buildPayload()).subscribe({
      next: (policy) => {
        this.submitting.set(false);
        this.confirmedPolicy.set(policy);
      },
      error: () => this.submitting.set(false)
    });
  }

  /**
   * The form groups the nominee fields for layout only; the backend expects a
   * flat body (`nomineeName`/`nomineeRelationship`/`nomineeContact`), so the
   * grouped value is flattened here before it is sent.
   */
  private buildPayload(): PurchasePolicyRequest {
    const raw = this.form.getRawValue();
    const contact = raw.nominee.contactNumber.trim();
    const payload: PurchasePolicyRequest = {
      productId: raw.productId,
      nomineeName: raw.nominee.name.trim(),
      nomineeRelationship: raw.nominee.relationship.trim()
    };
    if (contact) {
      payload.nomineeContact = contact;
    }
    return payload;
  }
}
