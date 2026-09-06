import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-product-compare',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinner, EmptyState],
  templateUrl: './product-compare.html',
  styleUrl: './product-compare.scss'
})
export class ProductCompare implements OnInit {
  readonly loading = signal(true);
  readonly products = signal<Product[]>([]);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    const idsParam = this.route.snapshot.queryParamMap.get('ids') || '';
    const ids = idsParam
      .split(',')
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));

    if (!ids.length) {
      this.loading.set(false);
      return;
    }

    this.productService.compare(ids).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
