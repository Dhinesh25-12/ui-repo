import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product, ProductRequest } from '../models/product.model';
import { PageResponse } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${environment.apiBaseUrl}/products`;

  constructor(private readonly http: HttpClient) {}

  /** Backend returns a paginated `Page<ProductResponse>`; unwrap to the flat list the UI needs. */
  getAll(params?: { category?: string; term?: string }): Observable<Product[]> {
    let query = '';
    if (params?.category || params?.term) {
      const search = new URLSearchParams();
      if (params.category) search.set('category', params.category);
      if (params.term) search.set('term', params.term);
      query = `?${search.toString()}`;
    }
    return this.http
      .get<PageResponse<Product>>(`${this.baseUrl}${query}`)
      .pipe(map((page) => page.content));
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  /** Compares multiple products in a single request instead of fetching them one by one. */
  compare(ids: number[]): Observable<Product[]> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<Product[]>(`${this.baseUrl}/compare`, { params });
  }

  create(payload: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, payload);
  }

  update(id: number, payload: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
