import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../core/models/product.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinner, EmptyState],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  readonly loading = signal(true);
  readonly products = signal<Product[]>([]);
  readonly selectedIds = signal<Set<number>>(new Set());

  term = '';
  category: ProductCategory | '' = '';

  readonly categories: ProductCategory[] = ['HEALTH', 'MOTOR', 'LIFE', 'TRAVEL'];

  constructor(
    private readonly productService: ProductService,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.productService
      .getAll({ category: this.category || undefined, term: this.term || undefined })
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  toggleSelection(id: number): void {
    const selection = new Set(this.selectedIds());
    if (selection.has(id)) {
      selection.delete(id);
    } else {
      selection.add(id);
    }
    this.selectedIds.set(selection);
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  compareQueryParam(): string {
    return Array.from(this.selectedIds()).join(',');
  }
}
