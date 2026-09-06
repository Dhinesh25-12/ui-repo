import { Component, OnInit, signal , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductCategory } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-admin.html',
  styleUrl: './product-admin.scss'
})
export class ProductAdmin implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly saving = signal(false);
  readonly isEdit = signal(false);
  productId: number | null = null;

  readonly categories: ProductCategory[] = ['HEALTH', 'MOTOR', 'LIFE', 'TRAVEL'];

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['HEALTH' as ProductCategory, Validators.required],
    coverageAmount: [0, [Validators.required, Validators.min(1)]],
    premiumAmount: [0, [Validators.required, Validators.min(1)]],
    tenureMonths: [12, [Validators.required, Validators.min(1)]],
    description: ['']
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly notifications: NotificationService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.productId = Number(idParam);
      this.isEdit.set(true);
      this.productService.getById(this.productId).subscribe({
        next: (product) => this.form.patchValue(product),
        error: () => {
          /* user-facing notification is shown by the global error interceptor */
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const request$ = this.isEdit() && this.productId
      ? this.productService.update(this.productId, payload)
      : this.productService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.notifications.success(`Product ${this.isEdit() ? 'updated' : 'created'} successfully.`);
        this.router.navigate(['/products']);
      },
      error: () => this.saving.set(false)
    });
  }

  deleteProduct(): void {
    if (!this.productId) return;
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.productId).subscribe({
      next: () => {
        this.notifications.success('Product deleted.');
        this.router.navigate(['/products']);
      },
      error: () => {
        /* user-facing notification is shown by the global error interceptor */
      }
    });
  }
}
