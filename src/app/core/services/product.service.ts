import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${environment.apiBaseUrl}/products`;

  constructor(private readonly http: HttpClient) {}

  getAll(params?: { category?: string; term?: string }): Observable<Product[]> {
    let query = '';
    if (params?.category || params?.term) {
      const search = new URLSearchParams();
      if (params.category) search.set('category', params.category);
      if (params.term) search.set('term', params.term);
      query = `?${search.toString()}`;
    }
    return this.http.get<Product[]>(`${this.baseUrl}${query}`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  /** Compares multiple products in a single request instead of fetching them one by one. */
  compare(ids: number[]): Observable<Product[]> {
    const query = new URLSearchParams();
    query.set('ids', ids.join(','));
    return this.http.get<Product[]>(`${this.baseUrl}/compare?${query.toString()}`);
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
